"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, FolderOpen, Users, Mail, Image, FileText, MessageSquare, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Services", href: "/admin/services", icon: Package },
        { name: "Projects", href: "/admin/projects", icon: FolderOpen },
        { name: "Clients", href: "/admin/clients", icon: Users },
        { name: "Leads", href: "/admin/leads", icon: Mail },
        { name: "Media", href: "/admin/media", icon: Image },
        { name: "Blog", href: "/admin/blog", icon: FileText },
        { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    // Don't wrap login page
    if (pathname === "/admin/login") {
        return children;
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/30 flex flex-col">
                <div className="flex h-16 items-center border-b px-6">
                    <h1 className="text-lg font-bold">Ohmitex Admin</h1>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent/50"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <Button onClick={handleLogout} variant="outline" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="container py-8">{children}</div>
            </main>
        </div>
    );
}
