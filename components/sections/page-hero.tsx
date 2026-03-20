interface PageHeroProps {
    title: string;
    subtitle: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 py-24 md:py-32 lg:py-40">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

            <div className="container relative">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        {title}
                    </h1>

                    <p className="text-lg text-white/90 md:text-xl lg:text-2xl">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        fill="currentColor"
                        className="text-background"
                    />
                </svg>
            </div>
        </section>
    );
}
