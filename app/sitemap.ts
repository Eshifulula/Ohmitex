export const dynamic = 'force-dynamic';

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ohmitexcontrols.co.ke'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/clients`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // Legal pages — rarely change, low SEO priority
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date('2026-01-01'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-of-use`,
            lastModified: new Date('2026-01-01'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/licenses`,
            lastModified: new Date('2026-01-01'),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ]

    // Dynamic service pages
    const services = await prisma.service.findMany({
        select: { slug: true, updatedAt: true },
    })
    const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Dynamic project pages
    const projects = await prisma.project.findMany({
        select: { slug: true, updatedAt: true },
    })
    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    // Dynamic blog post pages
    const blogPosts = await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    })
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...staticPages, ...servicePages, ...projectPages, ...blogPages]
}

