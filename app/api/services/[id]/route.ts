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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const service = await prisma.service.findUnique({
            where: { id },
            include: { projects: true },
        });

        if (!service) {
            return NextResponse.json(
                { error: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch service' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const { id } = await params;
        const body = await request.json();
        const data = serviceSchema.partial().parse(body);

        const service = await prisma.service.update({
            where: { id },
            data,
        });

        return NextResponse.json(service);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update service' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const { id } = await params;
        await prisma.service.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete service' },
            { status: 500 }
        );
    }
}
