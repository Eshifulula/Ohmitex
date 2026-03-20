import { prisma } from "@/lib/prisma";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

async function getApprovedTestimonials() {
    return await prisma.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        take: 6,
    });
}

export async function TestimonialsSection() {
    const testimonials = await getApprovedTestimonials();

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-20 bg-muted/30">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Trusted by leading businesses across Kenya for automation and control solutions
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="group relative bg-card rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            {/* Quote icon */}
                            <div className="absolute -top-3 -left-3 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                                <Quote className="h-5 w-5 text-white" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-0.5 mb-4 pt-2">
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

                            {/* Content */}
                            <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                                &ldquo;{testimonial.content}&rdquo;
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                {testimonial.imageUrl ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-accent/20">
                                        <Image
                                            src={testimonial.imageUrl}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                        {testimonial.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    {(testimonial.position || testimonial.company) && (
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.position}
                                            {testimonial.position && testimonial.company && " at "}
                                            {testimonial.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
