"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";

interface Stat {
    value: number;
    suffix: string;
    label: string;
    sublabel: string;
}

const stats: Stat[] = [
    {
        value: 50,
        suffix: "+",
        label: "BMS Maintenance",
        sublabel: "Active maintenance contracts",
    },
    {
        value: 100,
        suffix: "+",
        label: "BMS Projects",
        sublabel: "Complete implementations",
    },
    {
        value: 75,
        suffix: "+",
        label: "MCC Projects",
        sublabel: "Motor control centers",
    },
    {
        value: 200,
        suffix: "+",
        label: "Lighting Control",
        sublabel: "Advanced systems",
    },
];

function Counter({ end, suffix, duration = 2000 }: { end: number; suffix: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const increment = end / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-bold text-accent">
            {count}
            {suffix}
        </div>
    );
}

export function StatisticsSection() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

            <div className="container relative">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <TrendingUp className="h-6 w-6 text-accent" />
                        <span className="text-accent font-semibold">Our Track Record</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                        Project Statistics
                    </h2>
                    <p className="text-base md:text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                        Proven track record of successful automation and control system implementations
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative rounded-xl bg-white/10 backdrop-blur-sm p-6 md:p-8 border border-white/10 text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/15 hover:border-accent/50 hover:-translate-y-1"
                        >
                            {/* Accent line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-t-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />

                            <Counter end={stat.value} suffix={stat.suffix} />
                            <h3 className="mt-4 text-xl md:text-2xl font-bold">{stat.label}</h3>
                            <p className="mt-2 text-sm md:text-base text-primary-foreground/80">
                                {stat.sublabel}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
