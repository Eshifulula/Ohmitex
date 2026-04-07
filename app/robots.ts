import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'

    return {
        rules: [
            {
                // Standard crawlers — allow public content, block admin & API
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/_next/',
                    '/static/',
                ],
            },
            {
                // Block GPTBot (OpenAI) from training on content
                userAgent: 'GPTBot',
                disallow: '/',
            },
            {
                // Block Google-Extended (Bard/Gemini training)
                userAgent: 'Google-Extended',
                disallow: '/',
            },
            {
                // Block CCBot (Common Crawl — used for AI training datasets)
                userAgent: 'CCBot',
                disallow: '/',
            },
            {
                // Block anthropic-ai training crawler
                userAgent: 'anthropic-ai',
                disallow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}
