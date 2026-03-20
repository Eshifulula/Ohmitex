export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ServicesGrid } from "@/components/sections/services-grid";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
    title: "Our Services",
    description:
        "Explore Ohmitex Smart Controls' full range of automation services: control panel design & assembly, building management systems (BMS), home automation, energy management, industrial automation and calibration services in Kenya.",
    openGraph: {
        title: "Automation & Control Services in Kenya | Ohmitex Smart Controls",
        description:
            "From DDC control panels and BMS to home automation and PLC-based industrial systems — Ohmitex Smart Controls delivers end-to-end automation solutions across Kenya.",
    },
};


export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { createdAt: "asc" },
    });

    return (
        <>
            <PageHero
                title="Our Services"
                subtitle="Comprehensive automation and control solutions tailored to your needs"
            />

            <ServicesGrid services={services} />
        </>
    );
}
