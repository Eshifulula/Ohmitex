import { Building2 } from "lucide-react";

interface Client {
    id: string;
    name: string;
    logoUrl?: string | null;
}

interface ClientsGridProps {
    clients: Client[];
}

export function ClientsGrid({ clients }: ClientsGridProps) {
    return (
        <section className="py-16 md:py-20 bg-muted/30">
            <div className="container">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Proud to partner with leading organizations across Kenya
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            className="group relative aspect-video flex items-center justify-center rounded-xl bg-background border-2 border-border p-4 md:p-6 transition-all duration-300 hover:border-accent hover:shadow-lg hover:-translate-y-1"
                        >
                            {client.logoUrl ? (
                                <img
                                    src={client.logoUrl}
                                    alt={client.name}
                                    className="max-h-full max-w-full object-contain transition-all duration-300"
                                />
                            ) : (
                                <div className="text-center">
                                    <Building2 className="mx-auto h-8 w-8 md:h-10 md:w-10 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                                    <p className="mt-2 text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        {client.name}
                                    </p>
                                </div>
                            )}

                            {/* Accent corner on hover */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-t-accent border-l-[12px] border-l-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
