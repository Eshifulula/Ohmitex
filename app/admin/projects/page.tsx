export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";

export default async function AdminProjectsPage() {
    const projects = await prisma.project.findMany({
        include: { service: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-muted-foreground">Manage your project portfolio</p>
                </div>
                <Button asChild>
                    <Link href="/admin/projects/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-4 text-left font-medium">Title</th>
                            <th className="p-4 text-left font-medium">Client</th>
                            <th className="p-4 text-left font-medium">Service</th>
                            <th className="p-4 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id} className="border-b">
                                <td className="p-4 font-medium">{project.title}</td>
                                <td className="p-4 text-muted-foreground">{project.client}</td>
                                <td className="p-4 text-muted-foreground">{project.service.title}</td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/projects/${project.id}/edit`}>
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
