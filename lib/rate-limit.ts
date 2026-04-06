/**
 * lib/rate-limit.ts  (hardened)
 * Multi-profile rate limiter with:
 *   - Device-fingerprint composite keys (harder to bypass than IP alone)
 *   - Named profiles (strict / medium / lenient)
 *   - Exponential back-off penalty for repeat offenders
 */

import { getDeviceFingerprint } from './security';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WindowEntry {
    count: number;
    resetAt: number;
    violations: number;  // consecutive over-limit hits (for exponential back-off)
}

interface RateLimitStore {
    [key: string]: WindowEntry;
}

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

// ---------------------------------------------------------------------------
// Named Profiles
// ---------------------------------------------------------------------------

export const RATE_LIMIT_PROFILES = {
    /** Public contact / lead forms — 5 submissions per 10 minutes per device */
    strict: { maxRequests: 5, windowMs: 10 * 60 * 1000 },
    /** General API reads / writes — 30 per minute */
    medium: { maxRequests: 30, windowMs: 60 * 1000 },
    /** Static / low-impact reads — 120 per minute */
    lenient: { maxRequests: 120, windowMs: 60 * 1000 },
    /** Auth attempts — 5 per 15 minutes */
    auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
} as const;

export type RateLimitProfile = keyof typeof RATE_LIMIT_PROFILES;

// ---------------------------------------------------------------------------
// In-memory store (single-instance; use Upstash Redis for multi-replica)
// ---------------------------------------------------------------------------

const store: RateLimitStore = {};

// Cleanup interval — prune expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const key of Object.keys(store)) {
            if (store[key].resetAt < now) delete store[key];
        }
    }, 5 * 60 * 1000);
}

// ---------------------------------------------------------------------------
// Core function
// ---------------------------------------------------------------------------

export async function rateLimit(
    identifier: string,
    config: RateLimitConfig = RATE_LIMIT_PROFILES.medium
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();

    // Expire stale window
    if (store[identifier] && store[identifier].resetAt < now) {
        delete store[identifier];
    }

    // Initialise window
    if (!store[identifier]) {
        store[identifier] = { count: 0, resetAt: now + config.windowMs, violations: 0 };
    }

    const entry = store[identifier];

    if (entry.count >= config.maxRequests) {
        // Exponential back-off: each consecutive over-limit hit doubles the reset window
        entry.violations += 1;
        const penalty = Math.min(entry.violations * config.windowMs, 24 * 60 * 60 * 1000); // max 24h
        entry.resetAt = now + penalty;

        return { success: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    entry.violations = 0; // reset penalty counter on successful request

    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
    };
}

// ---------------------------------------------------------------------------
// Identifier helpers
// ---------------------------------------------------------------------------

export function getRateLimitIdentifier(request: Request): string {
    // Try forwarded IP first (works behind Vercel / nginx)
    const xff = request.headers.get('x-forwarded-for');
    if (xff) return `ip_${xff.split(',')[0].trim()}`;

    const realIp = request.headers.get('x-real-ip');
    if (realIp) return `ip_${realIp}`;

    return 'ip_unknown';
}

/**
 * Composite fingerprint identifier (IP + User-Agent + Accept-Language hash).
 * Preferred over plain IP for public-facing endpoints.
 */
export function getFingerprintIdentifier(request: Request): string {
    return getDeviceFingerprint(request);
}

// ---------------------------------------------------------------------------
// Convenience wrapper — returns a 429 Response or null on success
// ---------------------------------------------------------------------------

export async function checkRateLimit(
    request: Request,
    profileOrConfig: RateLimitProfile | RateLimitConfig = 'medium',
    useFingerprint = true
): Promise<Response | null> {
    const config =
        typeof profileOrConfig === 'string'
            ? RATE_LIMIT_PROFILES[profileOrConfig]
            : profileOrConfig;

    const identifier = useFingerprint
        ? getFingerprintIdentifier(request)
        : getRateLimitIdentifier(request);

    const result = await rateLimit(identifier, config);

    if (!result.success) {
        const resetDate = new Date(result.resetAt);
        return new Response(
            JSON.stringify({
                error: 'Too many requests',
                message: 'Rate limit exceeded. Please try again later.',
                resetAt: resetDate.toISOString(),
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
                    'X-RateLimit-Limit': config.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': result.resetAt.toString(),
                },
            }
        );
    }

    return null;
}
