export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/sections/page-hero";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, User, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | Ohmitex Smart Controls",
    description: "Stay updated with the latest news, insights, and updates from Ohmitex Smart Controls Ltd - Kenya's leading automation and control systems company.",
};

async function getPublishedPosts() {
    return await prisma.blogPost.findMany({
        where: { published: true },
        include: {
            author: { select: { name: true } },
            categories: true,
        },
        orderBy: { publishedAt: "desc" },
    });
}

async function getCategories() {
    return await prisma.blogCategory.findMany({
        include: {
            _count: { select: { posts: true } },
        },
    });
}

export default async function BlogPage() {
    const [posts, categories] = await Promise.all([
        getPublishedPosts(),
        getCategories(),
    ]);

    return (
        <>
            <PageHero
                title="Blog & Insights"
                subtitle="Stay updated with the latest news, industry insights, and updates from Ohmitex Smart Controls"
            />

            <section className="py-16 md:py-20">
                <div className="container">
                    <div className="grid gap-8 lg:grid-cols-4">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {posts.length === 0 ? (
                                <div className="text-center py-16 bg-muted/30 rounded-xl">
                                    <p className="text-muted-foreground text-lg">
                                        No blog posts published yet. Check back soon!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-8 md:grid-cols-2">
                                    {posts.map((post, index) => (
                                        <article
                                            key={post.id}
                                            className={`group relative overflow-hidden rounded-xl bg-card border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${index === 0 ? "md:col-span-2" : ""
                                                }`}
                                        >
                                            {post.featuredImage && (
                                                <div className={`relative overflow-hidden ${index === 0 ? "aspect-[2/1]" : "aspect-video"}`}>
                                                    <Image
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                </div>
                                            )}

                                            <div className="p-6">
                                                {/* Categories */}
                                                {post.categories.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {post.categories.map((cat) => (
                                                            <span
                                                                key={cat.id}
                                                                className="text-xs font-medium px-2.5 py-1 bg-accent/10 text-accent rounded-full"
                                                            >
                                                                {cat.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <h2 className={`font-bold mb-3 group-hover:text-accent transition-colors ${index === 0 ? "text-2xl md:text-3xl" : "text-xl"
                                                    }`}>
                                                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                                                        {post.title}
                                                    </Link>
                                                </h2>

                                                {post.excerpt && (
                                                    <p className="text-muted-foreground mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1.5">
                                                            <User className="h-4 w-4" />
                                                            {post.author.name}
                                                        </span>
                                                        {post.publishedAt && (
                                                            <span className="flex items-center gap-1.5">
                                                                <CalendarDays className="h-4 w-4" />
                                                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="flex items-center gap-1 text-accent hover:underline"
                                                    >
                                                        Read more
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-6">
                            {/* Categories */}
                            <div className="bg-card rounded-xl border p-6">
                                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                                {categories.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No categories yet</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <Link
                                                    href={`/blog?category=${category.slug}`}
                                                    className="flex items-center justify-between text-sm hover:text-accent transition-colors"
                                                >
                                                    <span>{category.name}</span>
                                                    <span className="text-muted-foreground">
                                                        ({category._count.posts})
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* CTA */}
                            <div className="bg-primary rounded-xl p-6 text-primary-foreground">
                                <h3 className="font-semibold text-lg mb-2">Need Automation Solutions?</h3>
                                <p className="text-sm text-primary-foreground/80 mb-4">
                                    Contact us for expert consultation on your automation needs.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                                >
                                    Get in Touch
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
}
