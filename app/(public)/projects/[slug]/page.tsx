import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Link from "next/link";

// Enable dynamic rendering to avoid database requirement during build
export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
        where: { slug },
        include: { service: true },
    });

    if (!project) {
        notFound();
    }

    return (
        <>
            <section className="py-20">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-8 aspect-video overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                            {project.imageUrl ? (
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 896px, 100vw"
                                />
                            ) : (
                                <Building2 className="h-24 w-24 text-muted-foreground" />
                            )}
                        </div>

                        <div className="mb-4 text-sm text-muted-foreground">
                            <Link href={`/services/${project.service.slug}`} className="hover:text-primary">
                                {project.service.title}
                            </Link>
                            {" · "}
                            {project.client}
                        </div>

                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                            {project.title}
                        </h1>

                        <div className="space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-line">
                                        {project.description}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Solution Delivered</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-line">
                                        {project.solution}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
