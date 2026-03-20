export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Star, Check, X, Pencil } from "lucide-react";

async function getTestimonials() {
    return await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export default async function TestimonialsPage() {
    const testimonials = await getTestimonials();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Testimonials</h1>
                    <p className="text-muted-foreground">Manage client testimonials</p>
                </div>
                <Button asChild>
                    <Link href="/admin/testimonials/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Testimonial
                    </Link>
                </Button>
            </div>

            {testimonials.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <p className="text-muted-foreground">No testimonials yet. Add your first!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="relative">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                                        {(testimonial.position || testimonial.company) && (
                                            <p className="text-sm text-muted-foreground">
                                                {testimonial.position}
                                                {testimonial.position && testimonial.company && " at "}
                                                {testimonial.company}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {testimonial.approved ? (
                                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                <Check className="h-3 w-3" />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                                <X className="h-3 w-3" />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Rating */}
                                <div className="flex gap-0.5 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= testimonial.rating
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    &ldquo;{testimonial.content}&rdquo;
                                </p>

                                <div className="flex justify-end">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/testimonials/${testimonial.id}`}>
                                            <Pencil className="mr-2 h-3 w-3" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
