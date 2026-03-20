"use client";
import Image from "next/image";
import { useState } from "react";

const partners = [
    { name: "Schneider Electric", logo: "/images/partners/schneider-electric.png" },
    { name: "ABB", logo: "/images/partners/abb.png" },
    { name: "Siemens", logo: "/images/partners/siemens.png" },
    { name: "Rockwell Automation", logo: "/images/partners/rockwell.png" },
    { name: "Honeywell", logo: "/images/partners/honeywell.png" },
    { name: "Phoenix Contact", logo: "/images/partners/phoenix-contact.png" },
    { name: "Wago", logo: "/images/partners/wago.png" },
    { name: "Beckhoff", logo: "/images/partners/beckhoff.png" },
    { name: "Mitsubishi Electric", logo: "/images/partners/mitsubishi-electric.png" },
    { name: "Omron", logo: "/images/partners/omron.png" },
];

// Duplicate for seamless loop
const allPartners = [...partners, ...partners];

function PartnerItem({ partner }: { partner: typeof partners[0] }) {
    const [src, setSrc] = useState(partner.logo);
    const [imgError, setImgError] = useState(false);

    const handleError = () => {
        // Try .jpg alternative before giving up
        if (!src.endsWith(".jpg")) {
            setSrc(src.replace(/\.(png|svg|webp)$/, ".jpg"));
        } else {
            setImgError(true);
        }
    };

    return (
        <div className="flex-shrink-0 flex items-center justify-center w-44 h-24 mx-4 rounded-xl bg-background border border-border px-6 py-4 transition-all duration-300">
            {!imgError ? (
                <div className="relative w-full h-full">
                    <Image
                        src={src}
                        alt={partner.name}
                        fill
                        className="object-contain"
                        onError={handleError}
                    />
                </div>
            ) : (
                <span className="text-sm font-semibold text-muted-foreground text-center leading-snug">
                    {partner.name}
                </span>
            )}
        </div>
    );
}

export function PartnersLogos() {
    return (
        <section className="py-16 md:py-20 bg-muted/30 overflow-hidden">
            <div className="container mb-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                        Our Trusted Partners
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        We work with leading manufacturers of electrical automation components to deliver world-class solutions
                    </p>
                </div>
            </div>

            {/* Marquee track — full bleed, outside container */}
            <div className="relative w-full">
                {/* Fade edges */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-muted/30 to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-muted/30 to-transparent z-10" />

                <div className="flex animate-marquee w-max">
                    {allPartners.map((partner, i) => (
                        <PartnerItem key={`${partner.name}-${i}`} partner={partner} />
                    ))}
                </div>
            </div>
        </section>
    );
}
