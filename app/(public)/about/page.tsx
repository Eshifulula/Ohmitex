import type { Metadata } from "next";
import Image from "next/image";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Ohmitex Smart Controls Ltd — Kenya's trusted engineering company specialising in automation, DDC control panels, BMS, home automation and industrial control systems in Nairobi.",
    openGraph: {
        title: "About Ohmitex Smart Controls Ltd | Automation Engineers in Kenya",
        description:
            "Ohmitex Smart Controls Ltd is a Nairobi-based engineering company specialising in building management systems, home automation, control panel design and industrial automation.",
    },
};


export default function AboutPage() {
    return (
        <>
            <PageHero
                title="About Us"
                subtitle="Ohmitex Smart Controls Ltd is an Engineering company that specializes in automation, control systems and instrumentation products"
            />

            <section className="py-20">
                <div className="container">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight">Who We Are</h2>
                            <p className="text-muted-foreground">
                                We are experts in building management systems, home automation, energy management systems, lighting control, industrial automation, design, and assembly of control panels.
                            </p>
                            <p className="text-muted-foreground">
                                Customer satisfaction is our core business, and therefore we take good time to listen to our customer needs which helps us design and offer the best solutions to them.
                            </p>
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                            <Image
                                src="/images/about-hero.jpg"
                                alt="Ohmitex Smart Controls – control panels and automation systems built for Kenyan industry"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <WhyChooseUs />
        </>
    );
}
