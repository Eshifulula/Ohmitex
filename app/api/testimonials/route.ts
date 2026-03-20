import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const testimonialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    company: z.string().optional(),
    position: z.string().optional(),
    content: z.string().min(10, "Content must be at least 10 characters"),
    rating: z.number().min(1).max(5).default(5),
    imageUrl: z.string().optional(),
    approved: z.boolean().default(false),
});

export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const body = await request.json();
        const data = testimonialSchema.parse(body);

        const testimonial = await prisma.testimonial.create({
            data,
        });

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error creating testimonial:", error);
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
    }
}
