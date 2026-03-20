import { CheckCircle2, Award, DollarSign, Zap } from "lucide-react";

const reasons = [
    {
        title: "Professionalism",
        icon: Award,
        description: "Working with Ohmitex means working with highly trained and skilled engineers. This guarantees delivery of excellent products and services to our clients. In addition, all our products are from trusted manufacturers with proven reliability in the field and our systems are designed with the latest technology that meet international standards for automation.",
    },
    {
        title: "Value-for-money",
        icon: DollarSign,
        description: "There is no small investment! At Ohmitex, we value every customer's investment and therefore endeavor to provide the best solutions that give them value for their money. Our products and services are not only affordable but durable and guarantee you long term service.",
    },
    {
        title: "Efficiency",
        icon: Zap,
        description: "Meeting customer needs satisfactorily is our business. Ohmitex is committed to respond aptly to customer enquiries and timely delivery of products and services. We do this by ensuring we have enough products in stock and our engineers are well experienced to swiftly design and develop your required system.",
    },
];

export function WhyChooseUs() {
    return (
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

            <div className="container relative">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Why Choose Us
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                        Customer satisfaction is our core business.
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {reasons.map((reason) => {
                        const Icon = reason.icon;
                        return (
                            <div
                                key={reason.title}
                                className="group relative rounded-xl bg-white/10 backdrop-blur-sm p-6 md:p-8 border border-white/10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/15 hover:border-accent/50 hover:-translate-y-1"
                            >
                                {/* Accent line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-t-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />

                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:bg-accent group-hover:text-white group-hover:scale-105">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-3 text-xl md:text-2xl font-bold">{reason.title}</h3>
                                <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
                                    {reason.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
