import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { sendLeadNotification } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
import { sanitizeObject, isHoneypotTriggered } from '@/lib/security';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Input schema — strict validation with length limits
// ---------------------------------------------------------------------------
const leadSchema = z.object({
    name: z.string().min(2, 'Name is too short').max(100, 'Name is too long').trim(),
    email: z.string().email('Invalid email address').max(254, 'Email is too long').trim().toLowerCase(),
    phone: z.string()
        .max(20, 'Phone number is too long')
        .regex(/^[+\d\s\-().]*$/, 'Invalid phone number format')
        .optional()
        .or(z.literal('')),
    company: z.string().max(150, 'Company name is too long').trim().optional(),
    message: z.string().min(10, 'Message is too short').max(2000, 'Message is too long').trim(),
    // Honeypot field — must be empty (bots fill it, humans leave it blank)
    website: z.string().max(0, 'Bot detected').optional(),
});

// ---------------------------------------------------------------------------
// GET — fetch all leads (admin only)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(leads);
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}

// ---------------------------------------------------------------------------
// POST — submit a new lead (public, rate-limited + honeypot protected)
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
    // Rate-limiting: strict profile — 5 submissions per 10 min per device fingerprint
    const rateLimitResult = await checkRateLimit(request, 'strict', true);
    if (rateLimitResult) return rateLimitResult;

    try {
        const body = await request.json();

        // Honeypot check — reject bots that fill hidden fields
        if (isHoneypotTriggered(body?.website)) {
            // Return 200 to fool bots into thinking it succeeded
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // Validate and parse with Zod
        const data = leadSchema.parse(body);

        // Sanitize string fields before persisting
        const sanitized = sanitizeObject({
            name: data.name,
            email: data.email,
            phone: data.phone ?? '',
            company: data.company ?? '',
            message: data.message,
        });

        const lead = await prisma.lead.create({
            data: {
                name: sanitized.name,
                email: sanitized.email,
                phone: sanitized.phone || undefined,
                company: sanitized.company || undefined,
                message: sanitized.message,
            },
        });

        // Send email notification (non-blocking)
        sendLeadNotification({
            name: sanitized.name,
            email: sanitized.email,
            phone: sanitized.phone || undefined,
            company: sanitized.company || undefined,
            message: sanitized.message,
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
