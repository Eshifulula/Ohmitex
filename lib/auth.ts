import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Lazy getter — validates JWT_SECRET at call time rather than at module load.
// A missing JWT_SECRET at startup would silently produce a zero-byte key,
// making every token verification fail with an opaque 401.
function getSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(
            '[Auth] JWT_SECRET environment variable is not set. ' +
            'Set a 64-character random string to enable authentication.'
        );
    }
    return new TextEncoder().encode(secret);
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    [key: string]: unknown; // Index signature for jose compatibility
}

// Cookie configuration
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
};

export async function signToken(payload: JWTPayload): Promise<string> {
    return new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
        .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as string,
        };
    } catch (error) {
        return null;
    }
}

export async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
        return null;
    }

    return verifyToken(token.value);
}

export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, COOKIE_OPTIONS);
}

export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}

export async function requireAuth(
    request: NextRequest
): Promise<{ session: JWTPayload } | NextResponse> {
    const token = request.cookies.get('auth-token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyToken(token.value);

    if (!session) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return { session };
}

export async function requireAdmin(
    request: NextRequest
): Promise<{ session: JWTPayload } | NextResponse> {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { session } = authResult;

    if (session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    return { session };
}

// Allows both ADMIN and EDITOR roles
export async function requireEditor(
    request: NextRequest
): Promise<{ session: JWTPayload } | NextResponse> {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { session } = authResult;

    if (session.role !== 'ADMIN' && session.role !== 'EDITOR') {
        return NextResponse.json({ error: 'Forbidden - Editor access required' }, { status: 403 });
    }

    return { session };
}

