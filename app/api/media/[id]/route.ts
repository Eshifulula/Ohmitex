import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    const { id } = await params;
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const media = await prisma.media.findUnique({
            where: { id },
            include: {
                uploadedBy: {
                    select: { name: true, email: true },
                },
            },
        });

        if (!media) {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(media);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch media" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    const { id } = await params;
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const body = await request.json();
        const { alt, tags, folder } = body;

        const media = await prisma.media.update({
            where: { id },
            data: {
                alt,
                tags,
                folder,
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update media" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    const { id } = await params;
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const media = await prisma.media.findUnique({
            where: { id },
        });

        if (!media) {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 }
            );
        }

        // Delete files from file system
        const filepath = join(process.cwd(), "public", media.url);
        if (existsSync(filepath)) {
            await unlink(filepath);
        }

        if (media.thumbnailUrl) {
            const thumbnailPath = join(process.cwd(), "public", media.thumbnailUrl);
            if (existsSync(thumbnailPath)) {
                await unlink(thumbnailPath);
            }
        }

        // Delete from database
        await prisma.media.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete media" },
            { status: 500 }
        );
    }
}

