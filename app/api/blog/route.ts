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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const published = searchParams.get("published");
        const category = searchParams.get("category");

        const where: any = {};
        if (published) {
            where.published = published === "true";
        }
        if (category) {
            where.categories = {
                some: {
                    slug: category,
                },
            };
        }

        const posts = await prisma.blogPost.findMany({
            where,
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                categories: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch blog posts" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { session } = authResult;

    try {
        const body = await request.json();
        const data = blogPostSchema.parse(body);

        const { categories, ...postData } = data;

        const post = await prisma.blogPost.create({
            data: {
                ...postData,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
                authorId: session.userId,
                categories: categories
                    ? {
                        connect: categories.map((id) => ({ id })),
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

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create blog post" },
            { status: 500 }
        );
    }
}
