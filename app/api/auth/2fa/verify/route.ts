import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { authenticator } from "otplib";

// Verify 2FA code and enable 2FA
export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { session } = authResult;

    try {
        const { code } = await request.json();

        if (!code || code.length !== 6) {
            return NextResponse.json(
                { error: "Invalid code format" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { twoFactorSecret: true, twoFactorEnabled: true },
        });

        if (!user || !user.twoFactorSecret) {
            return NextResponse.json(
                { error: "2FA setup not initiated" },
                { status: 400 }
            );
        }

        // Verify the code
        const isValid = authenticator.verify({
            token: code,
            secret: user.twoFactorSecret,
        });

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid verification code" },
                { status: 400 }
            );
        }

        // Enable 2FA
        await prisma.user.update({
            where: { id: session.userId },
            data: { twoFactorEnabled: true },
        });

        return NextResponse.json({
            success: true,
            message: "2FA has been enabled successfully",
        });
    } catch (error) {
        console.error("2FA verify error:", error);
        return NextResponse.json(
            { error: "Failed to verify 2FA code" },
            { status: 500 }
        );
    }
}

// Disable 2FA
export async function DELETE(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { session } = authResult;

    try {
        const { code } = await request.json();

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { twoFactorSecret: true, twoFactorEnabled: true },
        });

        if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
            return NextResponse.json(
                { error: "2FA is not enabled" },
                { status: 400 }
            );
        }

        // Verify the code before disabling
        const isValid = authenticator.verify({
            token: code,
            secret: user.twoFactorSecret,
        });

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid verification code" },
                { status: 400 }
            );
        }

        // Disable 2FA
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "2FA has been disabled",
        });
    } catch (error) {
        console.error("2FA disable error:", error);
        return NextResponse.json(
            { error: "Failed to disable 2FA" },
            { status: 500 }
        );
    }
}
