"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, X, Copy, Check, Image as ImageIcon, Trash2 } from "lucide-react";

interface Media {
    id: string;
    url: string;
    thumbnailUrl?: string;
    filename: string;
    originalName: string;
    size: number;
    width?: number;
    height?: number;
    alt?: string;
    createdAt: string;
}

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    selectionMode?: boolean;
}

export function MediaLibrary({ onSelect, selectionMode = false }: MediaLibraryProps) {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const response = await fetch("/api/media");
            const data = await response.json();
            setMedia(data.media || []);
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/media", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Upload failed");
                }
            }

            await fetchMedia();
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload files");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this file?")) return;

        try {
            const response = await fetch(`/api/media/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            setMedia(media.filter((m) => m.id !== id));
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete file");
        }
    };

    const copyUrl = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-muted-foreground">Loading media...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="flex items-center gap-4">
                <label htmlFor="file-upload">
                    <Button asChild disabled={uploading}>
                        <span className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            {uploading ? "Uploading..." : "Upload Images"}
                        </span>
                    </Button>
                </label>
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                />
                <p className="text-sm text-muted-foreground">
                    {media.length} {media.length === 1 ? "file" : "files"}
                </p>
            </div>

            {/* Media Grid */}
            {media.length === 0 ? (
                <Card className="p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No media files</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Upload images to get started
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                        <Card key={item.id} className="overflow-hidden group">
                            {/* Image */}
                            <div className="aspect-square relative bg-muted">
                                <img
                                    src={item.thumbnailUrl || item.url}
                                    alt={item.alt || item.originalName}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {selectionMode ? (
                                        <Button
                                            size="sm"
                                            onClick={() => onSelect?.(item.url)}
                                        >
                                            Select
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => copyUrl(item.id, item.url)}
                                            >
                                                {copiedId === item.id ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <p className="text-sm font-medium truncate" title={item.originalName}>
                                    {item.originalName}
                                </p>
                                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                                    <span>{formatFileSize(item.size)}</span>
                                    {item.width && item.height && (
                                        <span>
                                            {item.width} × {item.height}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
