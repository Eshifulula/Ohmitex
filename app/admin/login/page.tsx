"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [requires2FA, setRequires2FA] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let email = credentials.email;
        let password = credentials.password;

        // If not in 2FA mode, grab values from form and save them
        if (!requires2FA) {
            const formData = new FormData(e.currentTarget);
            email = formData.get("email") as string;
            password = formData.get("password") as string;
            setCredentials({ email, password });
        }

        const data: { email: string; password: string; twoFactorCode?: string } = {
            email,
            password,
        };

        // Include 2FA code if in 2FA mode
        if (requires2FA && twoFactorCode) {
            data.twoFactorCode = twoFactorCode;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            // Handle 2FA required response
            if (result.requires2FA) {
                setRequires2FA(true);
                return;
            }

            if (!response.ok) {
                throw new Error(result.error || "Login failed");
            }

            // Success - redirect to dashboard
            router.push("/admin/dashboard");
            router.refresh(); // Important to refresh Server Components expecting auth
        } catch (err: any) {
            setError(err.message || "Login failed");
            // Reset 2FA code on error
            if (requires2FA) {
                setTwoFactorCode("");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setRequires2FA(false);
        setTwoFactorCode("");
        setError("");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        {requires2FA && <ShieldCheck className="h-6 w-6 text-primary" />}
                        {requires2FA ? "Two-Factor Authentication" : "Admin Login"}
                    </CardTitle>
                    <CardDescription>
                        {requires2FA
                            ? "Enter the 6-digit code from your authenticator app"
                            : "Enter your credentials to access the admin dashboard"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!requires2FA ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="twoFactorCode">Authentication Code</Label>
                                    <Input
                                        id="twoFactorCode"
                                        name="twoFactorCode"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]{6}"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                                        className="text-center text-2xl tracking-widest"
                                        autoFocus
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground text-center">
                                        Open your authenticator app to view your code
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Verifying..." : requires2FA ? "Verify Code" : "Sign In"}
                            </Button>
                            {requires2FA && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleBack}
                                >
                                    Back to Login
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
