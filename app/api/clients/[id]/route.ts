import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const clientSchema = z.object({
    name: z.string().optional(),
    logoUrl: z.string().nullable().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const client = await prisma.client.findUnique({
            where: { id },
        });

        if (!client) {
            return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(client);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch client' },
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
        const data = clientSchema.parse(body);

        const client = await prisma.client.update({
            where: { id },
            data,
        });

        return NextResponse.json(client);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update client' },
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
        await prisma.client.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete client' },
            { status: 500 }
        );
    }
}
