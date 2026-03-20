import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { session } = authResult;

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "ohmitex/media";
        const alt = (formData.get("alt") as string) || "";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
        }

        // Upload to Cloudinary
        const url = await uploadImage(file, folder);

        // Generate thumbnail URL by appending transformation: w_300,h_300,c_fill
        const thumbnailUrl = url.replace('/upload/', '/upload/w_300,h_300,c_fill/');
        const filename = file.name;

        // Save to database
        const media = await prisma.media.create({
            data: {
                filename,
                originalName: file.name,
                mimeType: file.type,
                size: file.size,
                url,
                thumbnailUrl,
                width: null,
                height: null,
                alt,
                folder,
                uploadedById: session.userId,
            },
        });

        return NextResponse.json(media, { status: 201 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get("folder");
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const where = folder ? { folder } : undefined;

        const [media, total] = await Promise.all([
            prisma.media.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
                include: {
                    uploadedBy: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.media.count({ where }),
        ]);

        return NextResponse.json({
            media,
            total,
            limit,
            offset,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch media" },
            { status: 500 }
        );
    }
}
