"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldOff, Loader2, Copy, Check } from "lucide-react";

interface TwoFactorSetupProps {
    isEnabled: boolean;
    onStatusChange: () => void;
}

export function TwoFactorSetup({ isEnabled, onStatusChange }: TwoFactorSetupProps) {
    const [step, setStep] = useState<"idle" | "setup" | "verify" | "disable">("idle");
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const startSetup = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to start setup");
            }

            setQrCode(data.qrCode);
            setSecret(data.secret);
            setStep("setup");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyAndEnable = async () => {
        if (code.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/2fa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Verification failed");
            }

            setStep("idle");
            setCode("");
            setQrCode("");
            setSecret("");
            onStatusChange();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const disable2FA = async () => {
        if (code.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/2fa/verify", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to disable 2FA");
            }

            setStep("idle");
            setCode("");
            onStatusChange();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copySecret = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                    Add an extra layer of security to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === "idle" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                {isEnabled ? (
                                    <ShieldCheck className="h-8 w-8 text-green-500" />
                                ) : (
                                    <ShieldOff className="h-8 w-8 text-muted-foreground" />
                                )}
                                <div>
                                    <p className="font-medium">
                                        {isEnabled ? "2FA is enabled" : "2FA is not enabled"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {isEnabled
                                            ? "Your account is protected by two-factor authentication"
                                            : "Enable 2FA for enhanced security"}
                                    </p>
                                </div>
                            </div>
                            {isEnabled ? (
                                <Button
                                    variant="destructive"
                                    onClick={() => setStep("disable")}
                                >
                                    Disable 2FA
                                </Button>
                            ) : (
                                <Button onClick={startSetup} disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Enable 2FA
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {step === "setup" && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                                Scan this QR code with your authenticator app
                            </p>
                            {qrCode && (
                                <img
                                    src={qrCode}
                                    alt="2FA QR Code"
                                    className="mx-auto mb-4 rounded-lg border p-2 bg-white"
                                    width={200}
                                    height={200}
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Or enter this code manually:</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={secret}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={copySecret}
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button onClick={() => setStep("verify")} className="w-full">
                            I&apos;ve scanned the code
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setStep("idle")}
                            className="w-full"
                        >
                            Cancel
                        </Button>
                    </div>
                )}

                {step === "verify" && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Enter the 6-digit code from your authenticator app to verify setup
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="code">Verification Code</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="000000"
                                className="text-center text-2xl tracking-widest font-mono"
                                maxLength={6}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setStep("setup")}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={verifyAndEnable}
                                disabled={loading || code.length !== 6}
                                className="flex-1"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify & Enable
                            </Button>
                        </div>
                    </div>
                )}

                {step === "disable" && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Enter your 2FA code to disable two-factor authentication
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="disable-code">Verification Code</Label>
                            <Input
                                id="disable-code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="000000"
                                className="text-center text-2xl tracking-widest font-mono"
                                maxLength={6}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStep("idle");
                                    setCode("");
                                    setError("");
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={disable2FA}
                                disabled={loading || code.length !== 6}
                                className="flex-1"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Disable 2FA
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
