"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Auto-dismiss success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Store form reference before async operations
        const form = e.currentTarget;

        // Reset states
        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(form);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            company: formData.get("company"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit");
            }

            setSuccess(true);
            setError(""); // Explicitly clear error
            form.reset(); // Use stored form reference
        } catch (err) {
            setSuccess(false); // Explicitly clear success
            setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input id="name" name="name" required disabled={loading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" name="email" type="email" required disabled={loading} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" type="tel" disabled={loading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" name="company" disabled={loading} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea id="message" name="message" required rows={5} disabled={loading} />
                    </div>

                    {success && (
                        <div className="flex items-start gap-3 rounded-md bg-green-50 p-4 border border-green-200">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-green-800">
                                <p className="font-medium">Thank you! We&apos;ll be in touch soon.</p>
                                <p className="text-green-700 mt-1">Your message has been successfully submitted.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start gap-3 rounded-md bg-red-50 p-4 border border-red-200">
                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-800">
                                <p className="font-medium">Failed to send message</p>
                                <p className="text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
