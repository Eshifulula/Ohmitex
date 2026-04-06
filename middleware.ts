import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import {
    getClientIp,
    isBlockedIp,
    isAdminIpDenied,
    isExploitPath,
    isMalicious,
    isBodyTooLarge,
} from '@/lib/security';

// ---------------------------------------------------------------------------
// JWT secret (validated lazily per-request)
// ---------------------------------------------------------------------------
function getSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('[Middleware] JWT_SECRET is not set');
    return new TextEncoder().encode(secret);
}

// ---------------------------------------------------------------------------
// Route configuration
// ---------------------------------------------------------------------------
const protectedRoutes = ['/admin'];
const publicRoutes = ['/admin/login'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function forbidden(message: string) {
    return new NextResponse(JSON.stringify({ error: message }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
    });
}

function badRequest(message: string) {
    return new NextResponse(JSON.stringify({ error: message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
    });
}

// ---------------------------------------------------------------------------
// Main middleware
// ---------------------------------------------------------------------------
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const ip = getClientIp(request);

    // ------------------------------------------------------------------
    // Layer 1: IP Blocklist — block known bad actors immediately
    // ------------------------------------------------------------------
    if (isBlockedIp(ip)) {
        return forbidden('Access denied');
    }

    // ------------------------------------------------------------------
    // Layer 2: Exploit path blocking (WAF — path-based)
    // Common scanner / exploit paths that should never exist on this app.
    // ------------------------------------------------------------------
    if (isExploitPath(pathname)) {
        return forbidden('Not found');
    }

    // ------------------------------------------------------------------
    // Layer 3: Basic WAF — scan URL + query string for attack patterns
    // ------------------------------------------------------------------
    const fullUrl = request.url;
    if (isMalicious(decodeURIComponent(fullUrl))) {
        return badRequest('Invalid request');
    }

    // ------------------------------------------------------------------
    // Layer 4: Request body size guard (via Content-Length header)
    // Rejects obviously oversized payloads before they reach route handlers.
    // ------------------------------------------------------------------
    if (isBodyTooLarge(request, 5 * 1024 * 1024)) { // 5 MB max
        return new NextResponse(JSON.stringify({ error: 'Payload too large' }), {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // ------------------------------------------------------------------
    // Layer 5: Admin route authentication + optional IP allowlist
    // ------------------------------------------------------------------
    const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r));
    const isPublicRoute = publicRoutes.some(r => pathname === r);

    if (isPublicRoute) {
        return NextResponse.next();
    }

    if (isProtectedRoute) {
        // Optional: restrict admin to specific IPs via ADMIN_ALLOWED_IPS env var
        if (isAdminIpDenied(ip)) {
            return forbidden('Admin access restricted');
        }

        const token = request.cookies.get('auth-token');

        if (!token) {
            const url = new URL('/admin/login', request.url);
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }

        try {
            await jwtVerify(token.value, getSecret());
            return NextResponse.next();
        } catch {
            const url = new URL('/admin/login', request.url);
            url.searchParams.set('from', pathname);
            const response = NextResponse.redirect(url);
            response.cookies.delete('auth-token');
            return response;
        }
    }

    // Allow all other routes
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimisation)
         * - favicon.ico
         * - public assets with file extensions
         *
         * NOTE: API routes are intentionally INCLUDED so the WAF and blocklist
         * layers apply to them as well (auth/body-size checks are done per-route).
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};
