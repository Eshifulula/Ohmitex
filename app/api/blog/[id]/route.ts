import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const blogPostSchema = z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().optional(),
    content: z.string(),
    featuredImage: z.string().optional(),
    published: z.boolean().optional(),
    publishedAt: z.string().datetime().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    const { id } = await params;

    try {
        const post = await prisma.blogPost.findUnique({
            where: { id },
            include: {
                author: {
                    select: { name: true, email: true },
                },
                categories: true,
            },
        });

        if (!post) {
            return NextResponse.json(
                { error: "Blog post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch blog post" },
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
        const data = blogPostSchema.partial().parse(body);

        const { categories, ...postData } = data;

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                ...postData,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
                categories: categories
                    ? {
                        set: categories.map((catId) => ({ id: catId })),
                    }
                    : undefined,
            },
            include: {
                author: {
                    select: { name: true, email: true },
                },
                categories: true,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update blog post" },
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
        await prisma.blogPost.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete blog post" },
            { status: 500 }
        );
    }
}

