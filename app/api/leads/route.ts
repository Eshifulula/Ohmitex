import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { sendLeadNotification } from '@/lib/email';
import { z } from 'zod';

const leadSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string(),
});

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(leads);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = leadSchema.parse(body);

        const lead = await prisma.lead.create({
            data,
        });

        // Send email notification (non-blocking)
        sendLeadNotification({
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            message: data.message,
        }).catch((err) => console.error('[Email] Notification failed:', err));

        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to submit lead' },
            { status: 500 }
        );
    }
}

