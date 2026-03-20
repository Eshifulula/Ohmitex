export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
    title: "Our Projects",
    description:
        "Browse 25+ completed automation projects by Ohmitex Smart Controls Ltd across Kenya. From hospital HVAC control systems and MCC panels to BMS installations and irrigation automation.",
    openGraph: {
        title: "Automation Projects in Kenya | Ohmitex Smart Controls",
        description:
            "See our portfolio of 25+ completed projects: MCC panels, BMS, HVAC controls, PLC systems and more — delivered to leading hospitals, commercial buildings and industrial facilities across Kenya.",
    },
};


export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <>
            <PageHero
                title="Our Projects"
                subtitle="Proven excellence across diverse industries"
            />

            <ProjectsGrid projects={projects} />
        </>
    );
}
