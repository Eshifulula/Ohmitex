import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const serviceSchema = z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    content: z.string().optional(),
    icon: z.string(),
    imageUrl: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.string().optional(),
});

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch services' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const body = await request.json();
        const data = serviceSchema.parse(body);

        const service = await prisma.service.create({
            data,
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create service' },
            { status: 500 }
        );
    }
}
