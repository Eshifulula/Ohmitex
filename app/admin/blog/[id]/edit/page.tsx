export const dynamic = 'force-dynamic';

import { BlogPostForm } from "@/components/forms/blog-post-form";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Blog Post</h1>
                <p className="text-muted-foreground">Update blog post content</p>
            </div>

            <BlogPostForm postId={id} />
        </div>
    );
}

