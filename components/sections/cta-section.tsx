import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-br from-accent via-accent/95 to-accent/90 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/50 to-transparent" />

            <div className="container relative">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
                        Get a Free Site Assessment
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-10">
                        Our engineers will assess your facility and design a custom automation or control system.
                        No obligation — just expert advice.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-white hover:bg-white/90 text-accent shadow-lg"
                        >
                            <Link href="/contact" className="group">
                                <Phone className="mr-2 h-5 w-5" />
                                Get Your Free Consultation
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                        >
                            <Link href="/projects">View Our Portfolio</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
