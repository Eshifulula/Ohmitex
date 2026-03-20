import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight } from "lucide-react";

interface Project {
    id: string;
    title: string;
    slug: string;
    client: string;
    description: string;
    imageUrl?: string | null;
}

interface ProjectsGridProps {
    projects: Project[];
    limit?: number;
}

export function ProjectsGrid({ projects, limit }: ProjectsGridProps) {
    const displayProjects = limit ? projects.slice(0, limit) : projects;

    return (
        <section className="py-16 md:py-20">
            <div className="container">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Our Projects
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Proven excellence across diverse industries
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayProjects.map((project) => (
                        <Card
                            key={project.id}
                            className="group overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                                {project.imageUrl ? (
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Building2 className="h-16 w-16 text-primary/20 transition-all duration-300 group-hover:text-accent group-hover:scale-110" />
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <CardHeader className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                                    <div className="text-xs sm:text-sm font-medium text-accent">{project.client}</div>
                                </div>
                                <CardTitle className="line-clamp-2 text-lg sm:text-xl group-hover:text-primary transition-colors">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-sm sm:text-base">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Link
                                    href={`/projects/${project.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                                >
                                    View Details
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {limit && projects.length > limit && (
                    <div className="mt-12 text-center">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                            <Link href="/projects" className="group">
                                View All Projects
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
