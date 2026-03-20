import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const clientSchema = z.object({
    name: z.string(),
    logoUrl: z.string().optional(),
});

export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const body = await request.json();
        const data = clientSchema.parse(body);

        const client = await prisma.client.create({
            data,
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create client' },
            { status: 500 }
        );
    }
}
