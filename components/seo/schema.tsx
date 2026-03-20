export function OrganizationSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ohmitex Smart Controls Ltd',
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        description:
            'Engineering company specializing in automation, control systems and instrumentation products in Kenya',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Nairobi',
            addressLocality: 'Nairobi',
            addressCountry: 'KE',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+254-725-753-008',
            contactType: 'Customer Service',
            email: 'info@ohmitexscontrols.co.ke',
        },
        sameAs: [
            'https://www.linkedin.com/company/ohmitex-smart-controls',
            'https://twitter.com/ohmitexcontrols',
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export function LocalBusinessSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${baseUrl}/#organization`,
        name: 'Ohmitex Smart Controls Ltd',
        image: `${baseUrl}/images/logo.png`,
        url: baseUrl,
        telephone: '+254-725-753-008',
        email: 'info@ohmitexscontrols.co.ke',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nairobi',
            addressCountry: 'Kenya',
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
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export function ServiceSchema({ service }: { service: { name: string; description: string; url: string } }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: service.name,
        description: service.description,
        provider: {
            '@type': 'Organization',
            name: 'Ohmitex Smart Controls Ltd',
            url: baseUrl,
        },
        areaServed: {
            '@type': 'Country',
            name: 'Kenya',
        },
        url: service.url,
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
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
