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
import { ImageUploader } from "@/components/ui/image-uploader";
import { X } from "lucide-react";

interface Service {
    id: string;
    title: string;
}

interface ProjectFormProps {
    projectId?: string;
}

export function ProjectForm({ projectId }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [services, setServices] = useState<Service[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        client: "",
        description: "",
        content: "",
        solution: "",
        imageUrl: "",
        gallery: [] as string[],
        serviceId: "",
        seoTitle: "",
        seoDescription: "",
    });

    useEffect(() => {
        // Fetch services for dropdown
        fetch("/api/services")
            .then(res => res.json())
            .then(data => setServices(data));

        if (projectId) {
            // Fetch existing project
            fetch(`/api/projects/${projectId}`)
                .then(res => res.json())
                .then(data => setFormData({
                    ...data,
                    gallery: data.gallery || [],
                }));
        }
    }, [projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = projectId ? `/api/projects/${projectId}` : "/api/projects";
            const method = projectId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save project");
            }

            router.push("/admin/projects");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save project");
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

    const addGalleryImage = () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
            setFormData({
                ...formData,
                gallery: [...formData.gallery, url],
            });
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData({
            ...formData,
            gallery: formData.gallery.filter((_, i) => i !== index),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
                <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Information</CardTitle>
                            <CardDescription>Basic project details</CardDescription>
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
                                    <Label htmlFor="client">Client Name *</Label>
                                    <Input
                                        id="client"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="serviceId">Service *</Label>
                                    <select
                                        id="serviceId"
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Select a service...</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="solution">Solution Summary *</Label>
                                <Textarea
                                    id="solution"
                                    value={formData.solution}
                                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                    rows={2}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Detailed Content</Label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    placeholder="Enter full project details, technical specifications, outcomes..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Media</CardTitle>
                            <CardDescription>Manage project images and gallery</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ImageUploader
                                value={formData.imageUrl}
                                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                label="Featured Image"
                                placeholder="Upload or enter featured image URL"
                            />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Gallery Images</Label>
                                </div>

                                {/* Gallery Grid */}
                                {formData.gallery.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {formData.gallery.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <div className="aspect-video rounded-lg border overflow-hidden bg-muted">
                                                    <img
                                                        src={url}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeGalleryImage(index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add to Gallery */}
                                <ImageUploader
                                    value=""
                                    onChange={(url) => {
                                        if (url) {
                                            setFormData({
                                                ...formData,
                                                gallery: [...formData.gallery, url],
                                            });
                                        }
                                    }}
                                    label="Add to Gallery"
                                    placeholder="Upload or enter gallery image URL"
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
                                    placeholder={formData.title || "Project Title"}
                                />
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
                    {loading ? "Saving..." : projectId ? "Update Project" : "Create Project"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
