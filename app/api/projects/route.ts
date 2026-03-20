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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get('serviceId');

        const projects = await prisma.project.findMany({
            where: serviceId ? { serviceId } : undefined,
            include: { service: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const body = await request.json();
        const data = projectSchema.parse(body);

        const project = await prisma.project.create({
            data,
            include: { service: true },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
