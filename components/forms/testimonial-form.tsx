"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2, Trash2 } from "lucide-react";

interface TestimonialFormProps {
    testimonialId?: string;
}

export function TestimonialForm({ testimonialId }: TestimonialFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        position: "",
        content: "",
        rating: 5,
        imageUrl: "",
        approved: false,
        featured: false,
    });

    useEffect(() => {
        if (testimonialId) {
            fetchTestimonial();
        }
    }, [testimonialId]);

    const fetchTestimonial = async () => {
        try {
            const res = await fetch(`/api/testimonials/${testimonialId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    company: data.company || "",
                    position: data.position || "",
                    content: data.content || "",
                    rating: data.rating || 5,
                    imageUrl: data.imageUrl || "",
                    approved: data.approved || false,
                    featured: data.featured || false,
                });
            }
        } catch (error) {
            console.error("Error fetching testimonial:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = testimonialId
                ? `/api/testimonials/${testimonialId}`
                : "/api/testimonials";
            const method = testimonialId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/testimonials");
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save testimonial");
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
            alert("Failed to save testimonial");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/testimonials/${testimonialId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/admin/testimonials");
                router.refresh();
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Testimonial Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    {/* Position & Company */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input
                                id="position"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                placeholder="CEO"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="Acme Corp"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Testimonial Content *</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Share what the client said..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`h-6 w-6 ${star <= formData.rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-gray-300 hover:text-amber-200"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Photo URL (optional)</Label>
                        <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    {/* Approved */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="approved"
                            checked={formData.approved}
                            onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="approved" className="font-normal">
                            Approved (show on public website)
                        </Label>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="featured" className="font-normal">
                            Featured (highlight on homepage)
                        </Label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4">
                        <div>
                            {testimonialId && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/testimonials")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {testimonialId ? "Update" : "Create"} Testimonial
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
