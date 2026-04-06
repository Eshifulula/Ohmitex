/**
 * lib/security.ts
 * Central security utilities for Ohmitex web application.
 * Covers: input sanitization, device fingerprinting, WAF patterns,
 * honeypot validation, and IP allowlist / blocklist helpers.
 */

// ---------------------------------------------------------------------------
// 1. Input Sanitization
// ---------------------------------------------------------------------------

/** Strip HTML tags and common XSS vectors from a string. */
export function sanitizeString(input: string): string {
    return input
        .replace(/<[^>]*>/g, '')                      // strip HTML tags
        .replace(/javascript:/gi, '')                  // remove JS URIs
        .replace(/on\w+\s*=/gi, '')                    // remove event handlers
        .replace(/data:/gi, '')                        // remove data URIs
        .trim();
}

/** Sanitize all string values in a plain object (one level deep). */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = sanitizeString(value);
        } else {
            result[key] = value;
        }
    }
    return result as T;
}

// ---------------------------------------------------------------------------
// 2. WAF Pattern Detection
// ---------------------------------------------------------------------------

/** Common SQL injection pattern strings (no /g flag — avoids lastIndex statefulness) */
const SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/i,
    /(-{2}|\/\*|\*\/)/,           // SQL comments
    /(;|\||&&)/,                   // command chaining
    /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i, // tautology injection
    /'\s*(OR|AND)\s*'/i,
    /xp_\w+/i,                     // MSSQL stored procs
];

/** Common XSS pattern strings */
const XSS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/i,
    /javascript\s*:/i,
    /on\w+\s*=\s*["'][^"']*["']/i,
    /expression\s*\(/i,
    /vbscript\s*:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
];

/** Common path traversal / exploit patterns */
const EXPLOIT_PATH_PATTERNS = [
    /\.\.\//,                       // path traversal
    /\/wp-admin/i,
    /\/wp-login/i,
    /\/phpMyAdmin/i,
    /\/phpmyadmin/i,
    /\/\.env/i,
    /\/\.git/i,
    /\/\.htaccess/i,
    /\/config\.php/i,
    /\/xmlrpc\.php/i,
    /\/cgi-bin/i,
    /\/etc\/passwd/i,
    /\/proc\/self/i,
];

export function containsSQLInjection(input: string): boolean {
    return SQL_INJECTION_PATTERNS.some(p => p.test(input));
}

export function containsXSS(input: string): boolean {
    return XSS_PATTERNS.some(p => p.test(input));
}

export function isExploitPath(path: string): boolean {
    return EXPLOIT_PATH_PATTERNS.some(p => p.test(path));
}

/** Returns true if the input contains any detected attack pattern. */
export function isMalicious(input: string): boolean {
    return containsSQLInjection(input) || containsXSS(input);
}

// ---------------------------------------------------------------------------
// 3. Device Fingerprinting
// ---------------------------------------------------------------------------

/**
 * Build a composite rate-limit identifier from IP + User-Agent + Accept-Language.
 * This is harder to spoof than IP alone and survives simple IP rotation.
 * Falls back gracefully when headers are missing.
 */
export function getDeviceFingerprint(request: Request): string {
    const parts: string[] = [];

    // IP address (supports reverse-proxy headers)
    const xff = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = xff ? xff.split(',')[0].trim() : (realIp || 'unknown-ip');
    parts.push(ip);

    // Browser / UA slice (first 80 chars to avoid excessive variance)
    const ua = (request.headers.get('user-agent') || 'unknown-ua').slice(0, 80);
    parts.push(ua);

    // Language preference
    const lang = request.headers.get('accept-language')?.slice(0, 20) || 'unknown-lang';
    parts.push(lang);

    // Simple deterministic hash (djb2 variant)
    let hash = 5381;
    const combined = parts.join('|');
    for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) + hash) ^ combined.charCodeAt(i);
        hash = hash >>> 0; // keep unsigned 32-bit
    }

    return `dfp_${hash.toString(16)}`;
}

/** Extract raw IP from request headers (used for blocklist checks). */
export function getClientIp(request: Request): string {
    const xff = request.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return request.headers.get('x-real-ip') || 'unknown';
}

// ---------------------------------------------------------------------------
// 4. IP Allowlist / Blocklist
// ---------------------------------------------------------------------------

/**
 * Parse a comma-separated env var into a trimmed array.
 * Example: ADMIN_ALLOWED_IPS="1.2.3.4,5.6.7.8"
 */
function parseIpList(envVar: string | undefined): string[] {
    if (!envVar) return [];
    return envVar.split(',').map(ip => ip.trim()).filter(Boolean);
}

/** Returns true if the given IP is on the blocklist. */
export function isBlockedIp(ip: string): boolean {
    const blocked = parseIpList(process.env.BLOCKED_IPS);
    return blocked.includes(ip);
}

/**
 * Returns true if admin IP restriction is enabled AND the given IP is NOT
 * on the allowed list. Call this only for /admin routes.
 */
export function isAdminIpDenied(ip: string): boolean {
    const allowed = parseIpList(process.env.ADMIN_ALLOWED_IPS);
    // If env var is not set (empty list), restriction is disabled
    if (allowed.length === 0) return false;
    return !allowed.includes(ip);
}

// ---------------------------------------------------------------------------
// 5. Honeypot Validation
// ---------------------------------------------------------------------------

/**
 * Check that a honeypot field is empty.
 * Forms should include a hidden field (e.g., name="website") that bots fill.
 * Returns true if the honeypot was triggered (i.e., request is likely a bot).
 */
export function isHoneypotTriggered(honeypotValue: string | null | undefined): boolean {
    return typeof honeypotValue === 'string' && honeypotValue.trim().length > 0;
}

// ---------------------------------------------------------------------------
// 6. Request Size Guard
// ---------------------------------------------------------------------------

const MAX_BODY_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB default

/** Returns true if the Content-Length header exceeds the allowed maximum. */
export function isBodyTooLarge(
    request: Request,
    maxBytes: number = MAX_BODY_SIZE_BYTES
): boolean {
    const contentLength = request.headers.get('content-length');
    if (!contentLength) return false;
    return parseInt(contentLength, 10) > maxBytes;
}
