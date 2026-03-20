"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
    id: string;
    name: string;
}

interface BlogPostFormProps {
    postId?: string;
}

export function BlogPostForm({ postId }: BlogPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        published: false,
        publishedAt: "",
        categories: [] as string[],
        tags: [] as string[],
        seoTitle: "",
        seoDescription: "",
    });

    useEffect(() => {
        // Fetch categories
        fetch("/api/blog/categories")
            .then(res => res.json())
            .then(data => setCategories(data));

        if (postId) {
            // Fetch existing post
            fetch(`/api/blog/${postId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        title: data.title || "",
                        slug: data.slug || "",
                        excerpt: data.excerpt || "",
                        content: data.content || "",
                        featuredImage: data.featuredImage || "",
                        published: data.published || false,
                        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : "",
                        categories: data.categories?.map((c: Category) => c.id) || [],
                        tags: data.tags || [],
                        seoTitle: data.seoTitle || "",
                        seoDescription: data.seoDescription || "",
                    });
                });
        }
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = postId ? `/api/blog/${postId}` : "/api/blog";
            const method = postId ? "PATCH" : "POST";

            const payload = {
                ...formData,
                publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save blog post");
            }

            router.push("/admin/blog");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save blog post");
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        setFormData({ ...formData, slug });
    };

    const addTag = () => {
        const tag = window.prompt("Enter tag:");
        if (tag) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tag],
            });
        }
    };

    const removeTag = (index: number) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((_, i) => i !== index),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
                <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Blog Post Content</CardTitle>
                            <CardDescription>Write your blog post</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            required
                                        />
                                        <Button type="button" variant="outline" onClick={generateSlug}>
                                            Generate
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Content *</Label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    placeholder="Write your blog post content..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="featuredImage">Featured Image URL</Label>
                                <Input
                                    id="featuredImage"
                                    value={formData.featuredImage}
                                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="published">Published</Label>
                            </div>

                            {formData.published && (
                                <div className="space-y-2">
                                    <Label htmlFor="publishedAt">Publish Date</Label>
                                    <Input
                                        id="publishedAt"
                                        type="datetime-local"
                                        value={formData.publishedAt}
                                        onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Categories</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            const name = window.prompt("Enter new category name:");
                                            if (name) {
                                                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                                try {
                                                    const res = await fetch("/api/blog/categories", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ name, slug }),
                                                    });
                                                    if (res.ok) {
                                                        const newCat = await res.json();
                                                        setCategories([...categories, newCat]);
                                                        setFormData({
                                                            ...formData,
                                                            categories: [...formData.categories, newCat.id],
                                                        });
                                                    }
                                                } catch (err) {
                                                    console.error("Failed to create category:", err);
                                                }
                                            }
                                        }}
                                    >
                                        + Add Category
                                    </Button>
                                </div>
                                <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                                    {categories.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No categories yet. Add one above.</p>
                                    ) : (
                                        categories.map((cat) => (
                                            <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.categories.includes(cat.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                categories: [...formData.categories, cat.id],
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                categories: formData.categories.filter((id) => id !== cat.id),
                                                            });
                                                        }
                                                    }}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                                <span className="text-sm">{cat.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                {formData.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {formData.categories.map((catId) => {
                                            const cat = categories.find((c) => c.id === catId);
                                            return cat ? (
                                                <span
                                                    key={catId}
                                                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs"
                                                >
                                                    {cat.name}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                categories: formData.categories.filter((id) => id !== catId),
                                                            })
                                                        }
                                                        className="hover:text-blue-600"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Tags</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addTag}>
                                        Add Tag
                                    </Button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(i)}
                                                    className="hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="seoTitle">SEO Title</Label>
                                <Input
                                    id="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                    placeholder={formData.title || "Blog Post Title"}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seoDescription">SEO Description</Label>
                                <Textarea
                                    id="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
