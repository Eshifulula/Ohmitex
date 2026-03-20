"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, Image as ImageIcon, X, FolderOpen } from "lucide-react";
import { MediaLibrary } from "@/components/media/media-library";

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    placeholder?: string;
}

export function ImageUploader({ value, onChange, label = "Image", placeholder = "Enter image URL or upload" }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [urlInput, setUrlInput] = useState(value || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/media", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onChange(data.url);
            setUrlInput(data.url);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileUpload(files[0]);
        }
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleUrlSubmit = () => {
        onChange(urlInput);
    };

    const handleMediaSelect = (url: string) => {
        onChange(url);
        setUrlInput(url);
        setShowMediaLibrary(false);
    };

    const clearImage = () => {
        onChange("");
        setUrlInput("");
    };

    return (
        <div className="space-y-3">
            {label && <Label>{label}</Label>}

            {/* Preview */}
            {value && (
                <div className="relative inline-block">
                    <div className="border rounded-lg overflow-hidden bg-muted/30 p-2">
                        <img
                            src={value}
                            alt="Preview"
                            className="max-h-32 w-auto object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/placeholder.png";
                            }}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={clearImage}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}

            {/* Upload Options */}
            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upload">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                    </TabsTrigger>
                    <TabsTrigger value="url">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        URL
                    </TabsTrigger>
                    <TabsTrigger value="library">
                        <FolderOpen className="h-4 w-4 mr-1" />
                        Library
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-3">
                    {/* Drag and Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${dragActive
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25 hover:border-primary/50"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file);
                                e.target.value = "";
                            }}
                        />
                        <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        {uploading ? (
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        ) : (
                            <>
                                <p className="text-sm font-medium">
                                    Drag and drop an image here
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    or click to browse
                                </p>
                            </>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="url" className="mt-3">
                    <div className="flex gap-2">
                        <Input
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder={placeholder}
                        />
                        <Button type="button" onClick={handleUrlSubmit}>
                            Set
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="library" className="mt-3">
                    <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" className="w-full">
                                <FolderOpen className="h-4 w-4 mr-2" />
                                Browse Media Library
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Select Image from Library</DialogTitle>
                            </DialogHeader>
                            <MediaLibrary onSelect={handleMediaSelect} selectionMode />
                        </DialogContent>
                    </Dialog>
                </TabsContent>
            </Tabs>
        </div>
    );
}
