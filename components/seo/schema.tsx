const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'

// ─── Shared provider reference (used across schemas) ──────────────────────────
export const ORGANIZATION_REF = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Ohmitex Smart Controls Ltd',
    url: BASE_URL,
    logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
        width: 400,
        height: 200,
    },
}

// ─── Organization ─────────────────────────────────────────────────────────────
export function OrganizationSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'Ohmitex Smart Controls Ltd',
        url: BASE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/images/logo.png`,
            width: 400,
            height: 200,
        },
        description:
            'Kenya\'s leading engineering company specialising in automation, DDC control panels, building management systems (BMS), home automation and industrial control systems in Nairobi.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nairobi',
            addressRegion: 'Nairobi County',
            addressCountry: 'KE',
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: '+254-725-753-008',
                contactType: 'customer service',
                email: 'info@ohmitexcontrols.co.ke',
                availableLanguage: ['English'],
                areaServed: 'KE',
            },
            {
                '@type': 'ContactPoint',
                email: 'data@ohmitexcontrols.co.ke',
                contactType: 'data protection officer',
            },
        ],
        sameAs: [
            'https://www.linkedin.com/company/ohmitex-smart-controls',
            'https://twitter.com/ohmitexcontrols',
            'https://facebook.com/ohmitexcontrols',
        ],
        foundingLocation: {
            '@type': 'Place',
            name: 'Nairobi, Kenya',
        },
        areaServed: {
            '@type': 'Country',
            name: 'Kenya',
        },
        knowsAbout: [
            'Building Automation Systems',
            'Control Panel Design',
            'Building Management Systems',
            'Home Automation',
            'Industrial Automation',
            'HVAC Control',
            'Energy Management',
            'PLC and SCADA',
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

// ─── LocalBusiness ────────────────────────────────────────────────────────────
export function LocalBusinessSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${BASE_URL}/#local-business`,
        name: 'Ohmitex Smart Controls Ltd',
        image: `${BASE_URL}/images/logo.png`,
        url: BASE_URL,
        telephone: '+254-725-753-008',
        email: 'info@ohmitexcontrols.co.ke',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nairobi',
            addressRegion: 'Nairobi County',
            addressCountry: 'KE',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -1.286389,
            longitude: 36.817223,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '18:00',
            },
        ],
        priceRange: '$$',
        currenciesAccepted: 'KES',
        paymentAccepted: 'Bank Transfer, Cash',
        areaServed: {
            '@type': 'Country',
            name: 'Kenya',
        },
        hasMap: 'https://maps.google.com/?q=Nairobi,Kenya',
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

// ─── WebSite + SiteLinksSearchBox ────────────────────────────────────────────
export function WebSiteSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'Ohmitex Smart Controls Ltd',
        description: 'Kenya\'s leading automation and smart control systems company',
        publisher: { '@id': `${BASE_URL}/#organization` },
        inLanguage: 'en-KE',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

// ─── Service ─────────────────────────────────────────────────────────────────
export function ServiceSchema({ service }: {
    service: {
        name: string
        description: string
        url: string
        imageUrl?: string | null
    }
}) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        serviceType: service.name,
        description: service.description,
        url: service.url,
        image: service.imageUrl || undefined,
        provider: { '@id': `${BASE_URL}/#organization` },
        areaServed: {
            '@type': 'Country',
            name: 'Kenya',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: service.name,
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────
export function BreadcrumbSchema({ items }: {
    items: Array<{ name: string; url: string }>
}) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

// ─── BlogPosting ──────────────────────────────────────────────────────────────
export function BlogPostSchema({ post }: {
    post: {
        title: string
        excerpt?: string | null
        slug: string
        featuredImage?: string | null
        publishedAt?: Date | null
        updatedAt: Date
        authorName: string
    }
}) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || undefined,
        image: post.featuredImage || undefined,
        url: `${BASE_URL}/blog/${post.slug}`,
        datePublished: post.publishedAt?.toISOString() || post.updatedAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: {
            '@type': 'Person',
            name: post.authorName,
        },
        publisher: { '@id': `${BASE_URL}/#organization` },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/blog/${post.slug}`,
        },
        inLanguage: 'en-KE',
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

// ─── FAQPage ──────────────────────────────────────────────────────────────────
export function FAQSchema({ items }: {
    items: Array<{ question: string; answer: string }>
}) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

// ─── ContactPage ──────────────────────────────────────────────────────────────
export function ContactPageSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${BASE_URL}/contact`,
        url: `${BASE_URL}/contact`,
        name: 'Contact Ohmitex Smart Controls Ltd',
        description: 'Get in touch with Ohmitex Smart Controls Ltd for automation, BMS, control panels and industrial automation enquiries.',
        mainEntity: {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
