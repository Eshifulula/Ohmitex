"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { TwoFactorSetup } from "@/components/auth/two-factor-setup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings as SettingsIcon, Loader2 } from "lucide-react";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    twoFactorEnabled: boolean;
}

export default function SettingsPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and security</p>
            </div>

            {/* Profile Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Your account details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="text-lg">{user?.name || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-lg">{user?.email || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Role</p>
                            <p className="text-lg capitalize">{user?.role?.toLowerCase() || "—"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            {user && (
                <TwoFactorSetup
                    isEnabled={user.twoFactorEnabled}
                    onStatusChange={fetchUser}
                />
            )}
        </div>
    );
}
