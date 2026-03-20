export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about-section";
import { ServicesGrid } from "@/components/sections/services-grid";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { PartnersLogos } from "@/components/sections/partners-logos";
import { StatisticsSection } from "@/components/sections/statistics-section";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { ClientsGrid } from "@/components/sections/clients-grid";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTASection } from "@/components/sections/cta-section";
import { OrganizationSchema, LocalBusinessSchema } from "@/components/seo/schema";

export default async function HomePage() {
    const services = await prisma.service.findMany({
        orderBy: { createdAt: "asc" },
    });

    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
    });

    const clients = await prisma.client.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <>
            <OrganizationSchema />
            <LocalBusinessSchema />

            <Hero />
            <AboutSection />
            <ServicesGrid services={services} limit={6} />
            <WhyChooseUs />
            <PartnersLogos />
            <StatisticsSection />
            <ProjectsGrid projects={projects} limit={6} />
            <ClientsGrid clients={clients} />
            <TestimonialsSection />
            <CTASection />
        </>
    );
}
