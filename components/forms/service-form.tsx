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

interface ServiceFormProps {
    serviceId?: string;
}

export function ServiceForm({ serviceId }: ServiceFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        content: "",
        icon: "",
        imageUrl: "",
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
    });

    useEffect(() => {
        if (serviceId) {
            // Fetch existing service
            fetch(`/api/services/${serviceId}`)
                .then(res => res.json())
                .then(data => setFormData(data));
        }
    }, [serviceId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = serviceId ? `/api/services/${serviceId}` : "/api/services";
            const method = serviceId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save service");
            }

            router.push("/admin/services");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save service");
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
                <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Information</CardTitle>
                            <CardDescription>Basic service details</CardDescription>
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

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon (Lucide name) *</Label>
                                    <Input
                                        id="icon"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="Settings"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="imageUrl">Image URL</Label>
                                    <Input
                                        id="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="/images/service.jpg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Full Content</Label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    placeholder="Enter detailed service information..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                            <CardDescription>Optimize for search engines</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="seoTitle">SEO Title</Label>
                                <Input
                                    id="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                    placeholder={formData.title || "Service Title"}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Leave blank to use the service title
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seoDescription">SEO Description</Label>
                                <Textarea
                                    id="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                    rows={3}
                                    placeholder="Brief description for search results"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                                <Input
                                    id="seoKeywords"
                                    value={formData.seoKeywords}
                                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                    placeholder="automation, control systems, industrial"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Comma-separated keywords
                                </p>
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
                    {loading ? "Saving..." : serviceId ? "Update Service" : "Create Service"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
