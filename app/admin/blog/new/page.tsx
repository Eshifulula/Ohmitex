export const dynamic = 'force-dynamic'

import { BlogPostForm } from "@/components/forms/blog-post-form";

export default function NewBlogPostPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Create Blog Post</h1>
                <p className="text-muted-foreground">Write a new blog post</p>
            </div>

            <BlogPostForm />
        </div>
    );
}
