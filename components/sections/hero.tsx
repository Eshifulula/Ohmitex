import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 py-24 md:py-32 lg:py-40">

            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

            <div className="container relative">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-white">
                        <span className="inline-flex h-2 w-2 rounded-full bg-accent"></span>
                        Leading Automation Solutions in Kenya
                    </div>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                        Revolutionizing Automation &{" "}
                        <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                            Smart Control Systems
                        </span>
                    </h1>

                    <p className="mb-10 text-lg text-white/90 md:text-xl lg:text-2xl">
                        Building Kenya&apos;s Smartest Buildings & Homes with Cutting-Edge Technology
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-accent hover:bg-accent/90 text-white shadow-md transition-all"
                        >
                            <Link href="/services" className="group">
                                Explore Our Services
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                        >
                            <Link href="/contact">Get Free Quote</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom green wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                    {/* Green wave layer - sits on top */}
                    <path d="M0 150L48 140C96 130 192 110 288 100C384 90 480 90 576 95C672 100 768 110 864 115C960 120 1056 120 1152 112C1248 105 1344 90 1392 82L1440 75V150H1392C1344 150 1248 150 1152 150C1056 150 960 150 864 150C768 150 672 150 576 150C480 150 384 150 288 150C192 150 96 150 48 150H0Z" fill="#6EB43F" />
                    {/* White wave layer - sits below green */}
                    <path d="M0 150L60 140C120 130 240 110 360 100C480 90 600 90 720 95C840 100 960 110 1080 115C1200 120 1320 120 1380 120L1440 120V150H1380C1320 150 1200 150 1080 150C960 150 840 150 720 150C600 150 480 150 360 150C240 150 120 150 60 150H0Z" fill="currentColor" className="text-background" />
                </svg>
            </div>
        </section>
    );
}
