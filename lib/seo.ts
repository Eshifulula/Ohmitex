/**
 * lib/seo.ts
 * Metadata generator helpers for all page types.
 * Used with Next.js generateMetadata() API.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-image.jpg`
const SITE_NAME = 'Ohmitex Smart Controls Ltd'

interface SEOProps {
    title: string
    description: string
    keywords?: string | string[]
    ogImage?: string
    canonical?: string
    noindex?: boolean
    type?: 'website' | 'article'
    publishedAt?: Date
    modifiedAt?: Date
}

export function generateMetadata({
    title,
    description,
    keywords,
    ogImage,
    canonical,
    noindex = false,
    type = 'website',
    publishedAt,
    modifiedAt,
}: SEOProps) {
    const url = canonical || BASE_URL
    const image = ogImage || DEFAULT_OG_IMAGE
    const keywordsArray = Array.isArray(keywords)
        ? keywords
        : keywords?.split(',').map((k) => k.trim())

    return {
        title,
        description,
        keywords: keywordsArray,
        alternates: {
            canonical: url,
        },
        robots: noindex
            ? { index: false, follow: false }
            : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const } },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_NAME,
            locale: 'en_KE',
            type,
            ...(type === 'article' && publishedAt && {
                publishedTime: publishedAt.toISOString(),
                modifiedTime: modifiedAt?.toISOString(),
            }),
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image' as const,
            title,
            description,
            images: [image],
        },
    }
}

// ─── Service page metadata ────────────────────────────────────────────────────
export function generateServiceMetadata(service: {
    title: string
    description: string
    seoTitle?: string | null
    seoDescription?: string | null
    seoKeywords?: string | null
    slug: string
    imageUrl?: string | null
}) {
    return generateMetadata({
        title: service.seoTitle || `${service.title} Services in Kenya — Ohmitex`,
        description: service.seoDescription || service.description,
        keywords: service.seoKeywords || undefined,
        ogImage: service.imageUrl || undefined,
        canonical: `${BASE_URL}/services/${service.slug}`,
    })
}

// ─── Project page metadata ────────────────────────────────────────────────────
export function generateProjectMetadata(project: {
    title: string
    description: string
    seoTitle?: string | null
    seoDescription?: string | null
    slug: string
    imageUrl?: string | null
}) {
    return generateMetadata({
        title: project.seoTitle || `${project.title} — Ohmitex Projects`,
        description: project.seoDescription || project.description,
        ogImage: project.imageUrl || undefined,
        canonical: `${BASE_URL}/projects/${project.slug}`,
    })
}

// ─── Blog post metadata ───────────────────────────────────────────────────────
export function generateBlogPostMetadata(post: {
    title: string
    excerpt?: string | null
    seoTitle?: string | null
    seoDescription?: string | null
    slug: string
    featuredImage?: string | null
    publishedAt?: Date | null
    updatedAt: Date
    tags?: string[]
}) {
    return generateMetadata({
        title: post.seoTitle || `${post.title} — Ohmitex Blog`,
        description: post.seoDescription || post.excerpt || post.title,
        keywords: post.tags,
        ogImage: post.featuredImage || undefined,
        canonical: `${BASE_URL}/blog/${post.slug}`,
        type: 'article',
        publishedAt: post.publishedAt || undefined,
        modifiedAt: post.updatedAt,
    })
}
