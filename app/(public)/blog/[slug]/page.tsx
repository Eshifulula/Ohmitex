export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, User, ArrowLeft, Tag, Eye } from "lucide-react";
import { Metadata } from "next";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    const post = await prisma.blogPost.findUnique({
        where: { slug, published: true },
        include: {
            author: { select: { name: true } },
            categories: true,
        },
    });

    if (post) {
        // Increment view count
        await prisma.blogPost.update({
            where: { id: post.id },
            data: { views: { increment: 1 } },
        });
    }

    return post;
}

async function getRelatedPosts(currentId: string, categoryIds: string[]) {
    return await prisma.blogPost.findMany({
        where: {
            published: true,
            id: { not: currentId },
            categories: categoryIds.length > 0 ? {
                some: { id: { in: categoryIds } },
            } : undefined,
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            publishedAt: true,
        },
    });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: { title: true, seoTitle: true, seoDescription: true, excerpt: true, featuredImage: true },
    });

    if (!post) return { title: "Post Not Found" };

    return {
        title: post.seoTitle || `${post.title} | Ohmitex Blog`,
        description: post.seoDescription || post.excerpt || "",
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || "",
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts(
        post.id,
        post.categories.map((c) => c.id)
    );

    return (
        <>
            <PageHero title={post.title} subtitle="" />

            <article className="py-12 md:py-16">
                <div className="container max-w-4xl">
                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            {post.author.name}
                        </span>
                        {post.publishedAt && (
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4" />
                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            {post.views} views
                        </span>
                    </div>

                    {/* Categories */}
                    {post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="text-xs font-medium px-3 py-1.5 bg-accent/10 text-accent rounded-full"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="relative aspect-video overflow-hidden rounded-xl mb-10">
                            <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-accent prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-sm px-3 py-1 bg-muted rounded-full text-muted-foreground"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="container">
                        <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/blog/${related.slug}`}
                                    className="group bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all"
                                >
                                    {related.featuredImage && (
                                        <div className="relative aspect-video">
                                            <Image
                                                src={related.featuredImage}
                                                alt={related.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold group-hover:text-accent transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                        {related.publishedAt && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {new Date(related.publishedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-12 md:py-16">
                <div className="container max-w-4xl text-center">
                    <h2 className="text-2xl font-bold mb-4">Need Expert Automation Solutions?</h2>
                    <p className="text-muted-foreground mb-6">
                        Our team is ready to help you with building management systems, home automation, and industrial control solutions.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                        Contact Us Today
                    </Link>
                </div>
            </section>
        </>
    );
}
