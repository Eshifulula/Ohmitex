import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
    name: z.string().min(1).optional(),
    company: z.string().optional(),
    position: z.string().optional(),
    content: z.string().min(10).optional(),
    rating: z.number().min(1).max(5).optional(),
    imageUrl: z.string().optional(),
    approved: z.boolean().optional(),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const testimonial = await prisma.testimonial.findUnique({
            where: { id },
        });

        if (!testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("Error fetching testimonial:", error);
        return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const { id } = await params;
        const body = await request.json();
        const data = updateSchema.parse(body);

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data,
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error updating testimonial:", error);
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const { id } = await params;
        await prisma.testimonial.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
    }
}
