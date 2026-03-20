interface RateLimitStore {
    [key: string]: {
        count: number;
        resetAt: number;
    };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

export async function rateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const key = identifier;

    // Clean up expired entries
    if (store[key] && store[key].resetAt < now) {
        delete store[key];
    }

    // Initialize or get current state
    if (!store[key]) {
        store[key] = {
            count: 0,
            resetAt: now + config.windowMs,
        };
    }

    const current = store[key];

    // Check if limit exceeded
    if (current.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetAt: current.resetAt,
        };
    }

    // Increment counter
    current.count++;

    return {
        success: true,
        remaining: config.maxRequests - current.count,
        resetAt: current.resetAt,
    };
}

export function getRateLimitIdentifier(request: Request): string {
    // Try to get IP from headers (works with proxies)
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback to a generic identifier
    return 'unknown';
}

export async function checkRateLimit(
    request: Request,
    config?: RateLimitConfig
): Promise<Response | null> {
    const identifier = getRateLimitIdentifier(request);
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
                    'X-RateLimit-Limit': config?.maxRequests.toString() || '10',
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': result.resetAt.toString(),
                },
            }
        );
    }

    return null;
}
