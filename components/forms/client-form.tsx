"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Trash2 } from "lucide-react";

interface ClientFormProps {
    clientId?: string;
}

export function ClientForm({ clientId }: ClientFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        logoUrl: "",
    });

    useEffect(() => {
        if (clientId) {
            fetch(`/api/clients/${clientId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        name: data.name || "",
                        logoUrl: data.logoUrl || "",
                    });
                });
        }
    }, [clientId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = clientId ? `/api/clients/${clientId}` : "/api/clients";
            const method = clientId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save client");
            }

            router.push("/admin/clients");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save client");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!clientId) return;
        if (!confirm("Are you sure you want to delete this client?")) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/clients/${clientId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete client");
            }

            router.push("/admin/clients");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to delete client");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{clientId ? "Edit Client" : "Add New Client"}</CardTitle>
                    <CardDescription>
                        {clientId ? "Update client information" : "Add a new client to your portfolio"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Client Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter client name"
                            required
                        />
                    </div>

                    <ImageUploader
                        value={formData.logoUrl}
                        onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                        label="Client Logo"
                        placeholder="Upload or enter logo URL"
                    />
                </CardContent>
            </Card>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : clientId ? "Update Client" : "Add Client"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                {clientId && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className="ml-auto"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                )}
            </div>
        </form>
    );
}
