import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authenticator } from 'otplib';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    twoFactorCode: z.string().length(6).optional(),
});

export async function POST(request: NextRequest) {
    // Rate limiting: 5 attempts per 15 minutes
    const rateLimitResponse = await checkRateLimit(request, {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const body = await request.json();
        const { email, password, twoFactorCode } = loginSchema.parse(body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled && user.twoFactorSecret) {
            // If no 2FA code provided, request it
            if (!twoFactorCode) {
                return NextResponse.json({
                    requires2FA: true,
                    message: 'Please enter your 2FA code',
                });
            }

            // Verify 2FA code
            const isValidCode = authenticator.verify({
                token: twoFactorCode,
                secret: user.twoFactorSecret,
            });

            if (!isValidCode) {
                return NextResponse.json(
                    { error: 'Invalid 2FA code' },
                    { status: 401 }
                );
            }
        }

        // Generate token
        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // Set secure cookie
        await setAuthCookie(token);

        // Update last login time
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        // Return user data (without password)
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                twoFactorEnabled: user.twoFactorEnabled,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}

