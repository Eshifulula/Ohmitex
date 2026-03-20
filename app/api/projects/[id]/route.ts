import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const projectSchema = z.object({
    title: z.string(),
    slug: z.string(),
    client: z.string(),
    description: z.string(),
    content: z.string().optional(),
    solution: z.string(),
    imageUrl: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    serviceId: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: { service: true },
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch project' },
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
        const data = projectSchema.partial().parse(body);

        const project = await prisma.project.update({
            where: { id },
            data,
            include: { service: true },
        });

        return NextResponse.json(project);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update project' },
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
        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
