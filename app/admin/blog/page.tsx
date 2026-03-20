export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";

export default async function AdminBlogPage() {
    const posts = await prisma.blogPost.findMany({
        include: {
            author: {
                select: { name: true },
            },
            categories: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage your blog content</p>
                </div>
                <Button asChild>
                    <Link href="/admin/blog/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-4 text-left font-medium">Title</th>
                            <th className="p-4 text-left font-medium">Status</th>
                            <th className="p-4 text-left font-medium">Author</th>
                            <th className="p-4 text-left font-medium">Date</th>
                            <th className="p-4 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} className="border-b">
                                <td className="p-4 font-medium">{post.title}</td>
                                <td className="p-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${post.published
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {post.published ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="p-4 text-muted-foreground">{post.author.name}</td>
                                <td className="p-4 text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/blog/${post.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
