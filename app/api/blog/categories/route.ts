import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string(),
    slug: z.string(),
});

export async function GET() {
    try {
        const categories = await prisma.blogCategory.findMany({
            include: {
                _count: {
                    select: { posts: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const body = await request.json();
        const data = categorySchema.parse(body);

        const category = await prisma.blogCategory.create({
            data,
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
