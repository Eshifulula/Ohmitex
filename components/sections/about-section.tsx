import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutSection() {
    return (
        <section className="py-16 md:py-20">
            <div className="container">
                <div className="mx-auto max-w-4xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
                            About Ohmitex Smart Controls
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Ohmitex Smart Controls Ltd is an Engineering company that specializes in automation,
                            control systems and instrumentation products. Customer satisfaction is our core business,
                            and therefore we take good time to listen to our customer needs which helps us design and
                            offer the best solutions to them.
                        </p>
                    </div>

                    <div className="text-center mt-8">
                        <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                            <Link href="/about">
                                Learn More About Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
