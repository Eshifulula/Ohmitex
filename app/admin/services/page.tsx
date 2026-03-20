export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";

export default async function AdminServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { createdAt: "asc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Services</h1>
                    <p className="text-muted-foreground">Manage your service offerings</p>
                </div>
                <Button asChild>
                    <Link href="/admin/services/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-4 text-left font-medium">Title</th>
                            <th className="p-4 text-left font-medium">Slug</th>
                            <th className="p-4 text-left font-medium">Icon</th>
                            <th className="p-4 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id} className="border-b">
                                <td className="p-4 font-medium">{service.title}</td>
                                <td className="p-4 text-muted-foreground">{service.slug}</td>
                                <td className="p-4 text-muted-foreground">{service.icon}</td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/services/${service.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
