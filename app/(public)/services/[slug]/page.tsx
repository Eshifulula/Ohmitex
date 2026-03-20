import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import * as Icons from "lucide-react";

// Enable dynamic rendering to avoid database requirement during build
export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const service = await prisma.service.findUnique({
        where: { slug },
        include: {
            projects: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!service) {
        notFound();
    }

    const getIcon = (iconName: string) => {
        const Icon = (Icons as any)[iconName] || Icons.Box;
        return Icon;
    };

    const IconComponent = getIcon(service.icon);

    return (
        <>
            <section className="bg-muted/30 py-20">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <IconComponent className="h-8 w-8" />
                        </div>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                            {service.title}
                        </h1>
                        <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-line">
                            {service.description}
                        </div>
                    </div>
                </div>
            </section>

            {service.projects.length > 0 && (
                <ProjectsGrid projects={service.projects} />
            )}
        </>
    );
}
