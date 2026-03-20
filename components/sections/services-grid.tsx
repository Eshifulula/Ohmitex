import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";

interface Service {
    id: string;
    title: string;
    slug: string;
    description: string;
    icon: string;
}

interface ServicesGridProps {
    services: Service[];
    limit?: number;
}

export function ServicesGrid({ services, limit }: ServicesGridProps) {
    const displayServices = limit ? services.slice(0, limit) : services;

    const getIcon = (iconName: string) => {
        const Icon = (Icons as any)[iconName] || Icons.Box;
        return Icon;
    };

    return (
        <section className="py-20 bg-muted/30">
            <div className="container">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Our Services
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        From building management systems to motor control centres — engineered for Kenyan industry.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayServices.map((service) => {
                        const IconComponent = getIcon(service.icon);
                        return (
                            <Card
                                key={service.id}
                                className="group relative overflow-hidden border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:ring-2 hover:ring-accent hover:shadow-md hover:-translate-y-1"
                            >
                                {/* Accent line on hover */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />

                                <CardHeader className="space-y-4">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:bg-accent group-hover:text-white group-hover:scale-105">
                                        <IconComponent className="h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {service.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3 text-base">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Link
                                        href={`/services/${service.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                                    >
                                        Learn more
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {limit && services.length > limit && (
                    <div className="mt-12 text-center">
                        <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                            <Link href="/services" className="group">
                                View All Services
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
