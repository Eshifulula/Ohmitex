import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Validated lazily at request time — avoids crash if JWT_SECRET is missing at startup
function getSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('[Middleware] JWT_SECRET is not set');
    return new TextEncoder().encode(secret);
}

// Routes that require authentication
const protectedRoutes = ['/admin'];

// Public routes that don't require auth
const publicRoutes = ['/admin/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    // Allow public routes
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Check authentication for protected routes
    if (isProtectedRoute) {
        const token = request.cookies.get('auth-token');

        // No token - redirect to login
        if (!token) {
            const url = new URL('/admin/login', request.url);
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }

        // Verify token
        try {
            await jwtVerify(token.value, getSecret());
            // Token is valid, allow request
            return NextResponse.next();
        } catch (error) {
            // Invalid token - redirect to login
            const url = new URL('/admin/login', request.url);
            url.searchParams.set('from', pathname);
            const response = NextResponse.redirect(url);

            // Clear invalid token
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
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};
