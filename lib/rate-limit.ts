/**
 * lib/rate-limit.ts — Multi-algorithm rate limiter
 *
 * Supports four algorithms selectable per-profile:
 *
 *  ┌─────────────────┬──────────────────────────────────────────────────────┐
 *  │ Algorithm        │ Best for                                              │
 *  ├─────────────────┼──────────────────────────────────────────────────────┤
 *  │ fixed-window    │ Simple counters; slight boundary-spike risk           │
 *  │ sliding-window  │ Accurate rolling limit; eliminates boundary spikes    │
 *  │ token-bucket    │ Burst tolerance (fills at a rate, drains per request) │
 *  │ leaky-bucket    │ Smooth constant-rate enforcement; no burst allowed    │
 *  └─────────────────┴──────────────────────────────────────────────────────┘
 *
 * All algorithms run in-memory. For multi-replica deployments swap the store
 * for Redis/Upstash while keeping the same interface.
 */

import { getDeviceFingerprint } from './security';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RateLimitAlgorithm =
    | 'fixed-window'
    | 'sliding-window'
    | 'token-bucket'
    | 'leaky-bucket';

export interface RateLimitConfig {
    /** Maximum requests (or tokens) allowed per window */
    maxRequests: number;
    /** Window duration in milliseconds */
    windowMs: number;
    /** Algorithm to use (default: sliding-window) */
    algorithm?: RateLimitAlgorithm;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt: number;
    /** Retry-After in seconds (only > 0 when success = false) */
    retryAfterSecs: number;
}

// ─── Named Profiles ───────────────────────────────────────────────────────────
//
//  Profile       Algorithm        Limit           Use case
//  ──────────    ─────────────    ─────────────   ─────────────────────────────
//  strict        sliding-window   5 / 10 min      Contact/lead forms
//  medium        sliding-window   30 / 1 min      General API reads/writes
//  lenient       token-bucket     120 / 1 min     Static reads (allow bursts)
//  auth          token-bucket     5 / 15 min      Login attempts (burst → ban)
//  smooth        leaky-bucket     60 / 1 min      Webhooks / event streams

export const RATE_LIMIT_PROFILES = {
    strict:  { maxRequests: 5,   windowMs: 10 * 60 * 1000, algorithm: 'sliding-window'  as const },
    medium:  { maxRequests: 30,  windowMs: 60 * 1000,       algorithm: 'sliding-window'  as const },
    lenient: { maxRequests: 120, windowMs: 60 * 1000,       algorithm: 'token-bucket'    as const },
    auth:    { maxRequests: 5,   windowMs: 15 * 60 * 1000, algorithm: 'token-bucket'    as const },
    smooth:  { maxRequests: 60,  windowMs: 60 * 1000,       algorithm: 'leaky-bucket'   as const },
} as const;

export type RateLimitProfile = keyof typeof RATE_LIMIT_PROFILES;

// ─── Per-algorithm store entries ──────────────────────────────────────────────

interface FixedWindowEntry  { count: number;   resetAt: number; violations: number }
interface SlidingWindowEntry { timestamps: number[] }
interface TokenBucketEntry  { tokens: number;  lastRefill: number }
interface LeakyBucketEntry  { water: number;   lastLeak: number }

type StoreEntry =
    | { type: 'fixed-window';   data: FixedWindowEntry }
    | { type: 'sliding-window'; data: SlidingWindowEntry }
    | { type: 'token-bucket';   data: TokenBucketEntry }
    | { type: 'leaky-bucket';   data: LeakyBucketEntry };

const store = new Map<string, StoreEntry>();

// Cleanup: prune stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store) {
            let stale = false;
            if (entry.type === 'fixed-window')   stale = entry.data.resetAt < now;
            if (entry.type === 'sliding-window') stale = entry.data.timestamps.length === 0;
            if (entry.type === 'token-bucket')   stale = (now - entry.data.lastRefill) > 24 * 3600_000;
            if (entry.type === 'leaky-bucket')   stale = (now - entry.data.lastLeak)   > 24 * 3600_000;
            if (stale) store.delete(key);
        }
    }, 5 * 60 * 1000);
}

// ─── Algorithm implementations ────────────────────────────────────────────────

/**
 * FIXED WINDOW
 * ─ Divides time into discrete buckets (e.g. every 10 min).
 * ─ Simple but vulnerable to burst at window boundary (up to 2× rate).
 * ─ Exponential backoff applied to repeat violators.
 */
function fixedWindow(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const existing = store.get(key);
    let entry: FixedWindowEntry;

    if (!existing || existing.type !== 'fixed-window' || existing.data.resetAt < now) {
        entry = { count: 0, resetAt: now + config.windowMs, violations: 0 };
    } else {
        entry = existing.data;
    }

    if (entry.count >= config.maxRequests) {
        entry.violations += 1;
        // Exponential backoff: each violation doubles the penalty (max 24h)
        const penalty = Math.min(entry.violations * config.windowMs, 24 * 3600_000);
        entry.resetAt = now + penalty;
        store.set(key, { type: 'fixed-window', data: entry });
        return { success: false, remaining: 0, resetAt: entry.resetAt, retryAfterSecs: Math.ceil(penalty / 1000) };
    }

    entry.count++;
    entry.violations = 0;
    store.set(key, { type: 'fixed-window', data: entry });
    return { success: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt, retryAfterSecs: 0 };
}

/**
 * SLIDING WINDOW LOG
 * ─ Stores exact timestamps of recent requests.
 * ─ A request is allowed if fewer than maxRequests timestamps fall within
 *   the last windowMs milliseconds.
 * ─ Most accurate algorithm — no boundary spikes. Memory: O(maxRequests).
 * ─ Recommended for: contact forms, auth endpoints.
 */
function slidingWindow(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const existing = store.get(key);
    let timestamps: number[] =
        existing?.type === 'sliding-window'
            ? existing.data.timestamps.filter(t => t > windowStart) // evict old
            : [];

    if (timestamps.length >= config.maxRequests) {
        // The oldest timestamp in the window tells us when the slot frees up
        const oldestInWindow = timestamps[0];
        const resetAt = oldestInWindow + config.windowMs;
        store.set(key, { type: 'sliding-window', data: { timestamps } });
        return { success: false, remaining: 0, resetAt, retryAfterSecs: Math.ceil((resetAt - now) / 1000) };
    }

    timestamps.push(now);
    store.set(key, { type: 'sliding-window', data: { timestamps } });
    return {
        success: true,
        remaining: config.maxRequests - timestamps.length,
        resetAt: timestamps[0] + config.windowMs,
        retryAfterSecs: 0,
    };
}

/**
 * TOKEN BUCKET
 * ─ A bucket holds up to maxRequests tokens.
 * ─ Tokens refill at a constant rate (maxRequests per windowMs).
 * ─ Each request consumes one token. Empty bucket → rejected.
 * ─ Allows natural short bursts while enforcing the average rate.
 * ─ Recommended for: general API, CDN-style reads, lenient endpoints.
 *
 *   Example (120 tokens, 60s window → 2 tokens/sec refill rate):
 *   A client sitting idle for 30s accumulates 60 tokens and can burst
 *   60 requests instantly, then is throttled back to 2/sec.
 */
function tokenBucket(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const refillRate = config.maxRequests / config.windowMs; // tokens per ms

    const existing = store.get(key);
    let entry: TokenBucketEntry;

    if (!existing || existing.type !== 'token-bucket') {
        entry = { tokens: config.maxRequests, lastRefill: now };
    } else {
        entry = existing.data;
        // Refill tokens based on elapsed time
        const elapsed = now - entry.lastRefill;
        entry.tokens = Math.min(config.maxRequests, entry.tokens + elapsed * refillRate);
        entry.lastRefill = now;
    }

    if (entry.tokens < 1) {
        // Time until one token is available
        const waitMs = (1 - entry.tokens) / refillRate;
        const resetAt = now + waitMs;
        store.set(key, { type: 'token-bucket', data: entry });
        return { success: false, remaining: 0, resetAt, retryAfterSecs: Math.ceil(waitMs / 1000) };
    }

    entry.tokens -= 1;
    store.set(key, { type: 'token-bucket', data: entry });
    return {
        success: true,
        remaining: Math.floor(entry.tokens),
        resetAt: now + (1 / refillRate),
        retryAfterSecs: 0,
    };
}

/**
 * LEAKY BUCKET
 * ─ Requests drip into a bucket (queue). The bucket "leaks" (processes)
 *   at a fixed rate of maxRequests per windowMs.
 * ─ If the bucket is full (water >= maxRequests), the request is rejected.
 * ─ Produces perfectly smooth traffic — no bursting allowed.
 * ─ Recommended for: webhooks, payment APIs, event streams, downstream
 *   systems that cannot handle bursts.
 *
 *   Example (60 req/min → leaks 1 req/sec):
 *   Whether requests arrive 10 at once or 1/sec, they're processed at ≤1/sec.
 *   The bucket overflows (rejects) only if the arrival rate exceeds the leak rate
 *   AND the bucket is already full.
 */
function leakyBucket(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const leakRate = config.maxRequests / config.windowMs; // capacity leaked per ms

    const existing = store.get(key);
    let entry: LeakyBucketEntry;

    if (!existing || existing.type !== 'leaky-bucket') {
        entry = { water: 0, lastLeak: now };
    } else {
        entry = existing.data;
        // Drain the bucket based on elapsed time
        const elapsed = now - entry.lastLeak;
        entry.water = Math.max(0, entry.water - elapsed * leakRate);
        entry.lastLeak = now;
    }

    if (entry.water >= config.maxRequests) {
        // Bucket full — calculate when enough will have leaked to accept 1 more
        const waitMs = (entry.water - config.maxRequests + 1) / leakRate;
        const resetAt = now + waitMs;
        store.set(key, { type: 'leaky-bucket', data: entry });
        return { success: false, remaining: 0, resetAt, retryAfterSecs: Math.ceil(waitMs / 1000) };
    }

    entry.water += 1;
    store.set(key, { type: 'leaky-bucket', data: entry });
    return {
        success: true,
        remaining: Math.floor(config.maxRequests - entry.water),
        resetAt: now + (1 / leakRate),
        retryAfterSecs: 0,
    };
}

// ─── Router ───────────────────────────────────────────────────────────────────

export async function rateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const algorithm = config.algorithm ?? 'sliding-window';

    switch (algorithm) {
        case 'fixed-window':   return fixedWindow(identifier, config);
        case 'sliding-window': return slidingWindow(identifier, config);
        case 'token-bucket':   return tokenBucket(identifier, config);
        case 'leaky-bucket':   return leakyBucket(identifier, config);
    }
}

// ─── Identifier helpers ───────────────────────────────────────────────────────

export function getRateLimitIdentifier(request: Request): string {
    const xff = request.headers.get('x-forwarded-for');
    if (xff) return `ip_${xff.split(',')[0].trim()}`;
    const realIp = request.headers.get('x-real-ip');
    if (realIp) return `ip_${realIp}`;
    return 'ip_unknown';
}

/** Composite fingerprint: IP + User-Agent hash. Harder to bypass than IP alone. */
export function getFingerprintIdentifier(request: Request): string {
    return getDeviceFingerprint(request);
}

// ─── Convenience wrapper ─────────────────────────────────────────────────────
//
//  Returns a 429 Response (with standard headers) on limit exceeded,
//  or null if the request is within limits.

export async function checkRateLimit(
    request: Request,
    profileOrConfig: RateLimitProfile | RateLimitConfig = 'medium',
    useFingerprint = true
): Promise<Response | null> {
    const config: RateLimitConfig =
        typeof profileOrConfig === 'string'
            ? RATE_LIMIT_PROFILES[profileOrConfig]
            : profileOrConfig;

    const identifier = useFingerprint
        ? getFingerprintIdentifier(request)
        : getRateLimitIdentifier(request);

    const result = await rateLimit(identifier, config);

    if (!result.success) {
        return new Response(
            JSON.stringify({
                error: 'Too many requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: result.retryAfterSecs,
                resetAt: new Date(result.resetAt).toISOString(),
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': result.retryAfterSecs.toString(),
                    'X-RateLimit-Limit': config.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': result.resetAt.toString(),
                    'X-RateLimit-Algorithm': config.algorithm ?? 'sliding-window',
                },
            }
        );
    }

    return null;
}
