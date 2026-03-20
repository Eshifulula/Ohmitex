interface SEOProps {
    title: string
    description: string
    keywords?: string
    ogImage?: string
    canonical?: string
    noindex?: boolean
}

export function generateMetadata({
    title,
    description,
    keywords,
    ogImage,
    canonical,
    noindex = false,
}: SEOProps) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'
    const defaultOgImage = `${baseUrl}/images/og-image.jpg`

    return {
        title,
        description,
        keywords: keywords?.split(',').map((k) => k.trim()),
        robots: noindex ? 'noindex,nofollow' : 'index,follow',
        alternates: {
            canonical: canonical || baseUrl,
        },
        openGraph: {
            title,
            description,
            url: canonical || baseUrl,
            siteName: 'Ohmitex Smart Controls Ltd',
            images: [
                {
                    url: ogImage || defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'en_KE',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage || defaultOgImage],
        },
    }
}

export function generateServiceMetadata(service: {
    title: string
    description: string
    seoTitle?: string | null
    seoDescription?: string | null
    seoKeywords?: string | null
    slug: string
    imageUrl?: string | null
}) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'

    return generateMetadata({
        title: service.seoTitle || `${service.title} - Ohmitex Smart Controls`,
        description: service.seoDescription || service.description,
        keywords: service.seoKeywords || undefined,
        ogImage: service.imageUrl || undefined,
        canonical: `${baseUrl}/services/${service.slug}`,
    })
}

export function generateProjectMetadata(project: {
    title: string
    description: string
    seoTitle?: string | null
    seoDescription?: string | null
    slug: string
    imageUrl?: string | null
}) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'

    return generateMetadata({
        title: project.seoTitle || `${project.title} - Ohmitex Projects`,
        description: project.seoDescription || project.description,
        ogImage: project.imageUrl || undefined,
        canonical: `${baseUrl}/projects/${project.slug}`,
    })
}
