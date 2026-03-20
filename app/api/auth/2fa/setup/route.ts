import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { authenticator } from "otplib";
import QRCode from "qrcode";

// Generate 2FA secret and QR code
export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { session } = authResult;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { email: true, twoFactorEnabled: true, twoFactorSecret: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.twoFactorEnabled) {
            return NextResponse.json(
                { error: "2FA is already enabled" },
                { status: 400 }
            );
        }

        // Generate new secret
        const secret = authenticator.generateSecret();

        // Generate QR code URL
        const otpauthUrl = authenticator.keyuri(
            user.email,
            "Ohmitex Smart Controls",
            secret
        );

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

        // Store secret temporarily (not enabled yet)
        await prisma.user.update({
            where: { id: session.userId },
            data: { twoFactorSecret: secret },
        });

        return NextResponse.json({
            secret,
            qrCode: qrCodeDataUrl,
            otpauthUrl,
        });
    } catch (error) {
        console.error("2FA setup error:", error);
        return NextResponse.json(
            { error: "Failed to setup 2FA" },
            { status: 500 }
        );
    }
}
