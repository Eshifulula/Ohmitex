export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderOpen, Users, Mail, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeadsOverTimeChart } from "@/components/charts/leads-chart";

export default async function AdminDashboardPage() {
    // Get counts
    const [servicesCount, projectsCount, clientsCount, leadsCount] = await Promise.all([
        prisma.service.count(),
        prisma.project.count(),
        prisma.client.count(),
        prisma.lead.count(),
    ]);

    // Get recent leads
    const recentLeads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
            id: true,
            name: true,
            email: true,
            company: true,
            createdAt: true,
            status: true,
        },
    });

    // Get leads over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const leadsData = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
        SELECT DATE("createdAt") as date, COUNT(*)::int as count
        FROM "Lead"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
    `;

    const formattedLeadsData = leadsData.map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: Number(d.count),
    }));

    const stats = [
        {
            title: "Total Services",
            value: servicesCount,
            icon: Package,
            trend: "+0%",
            href: "/admin/services",
        },
        {
            title: "Total Projects",
            value: projectsCount,
            icon: FolderOpen,
            trend: "+0%",
            href: "/admin/projects",
        },
        {
            title: "Total Clients",
            value: clientsCount,
            icon: Users,
            trend: "+0%",
            href: "/admin/clients",
        },
        {
            title: "Total Leads",
            value: leadsCount,
            icon: Mail,
            trend: `+${formattedLeadsData.reduce((sum, d) => sum + d.count, 0)} this week`,
            href: "/admin/leads",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "new":
                return "bg-blue-100 text-blue-800";
            case "contacted":
                return "bg-yellow-100 text-yellow-800";
            case "qualified":
                return "bg-green-100 text-green-800";
            case "closed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to Ohmitex Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={stat.title} href={stat.href}>
                            <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stat.trend}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Charts & Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Leads Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Leads Over Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LeadsOverTimeChart data={formattedLeadsData} />
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Recent Leads
                        </CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/leads">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeads.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent leads</p>
                            ) : (
                                recentLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-start justify-between border-b pb-3 last:border-0"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {lead.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {lead.email}
                                                {lead.company && ` • ${lead.company}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                                lead.status
                                            )}`}
                                        >
                                            {lead.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                        <Button variant="outline" asChild>
                            <Link href="/admin/services/new">Add Service</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/projects/new">Add Project</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/clients">Manage Clients</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/media">Upload Media</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
