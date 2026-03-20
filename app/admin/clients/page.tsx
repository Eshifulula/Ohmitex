export const dynamic = 'force-dynamic'

import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";

export default async function AdminClientPage() {
    const clients = await prisma.client.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Clients</h1>
                    <p className="text-muted-foreground">Manage your client list</p>
                </div>
                <Button asChild>
                    <Link href="/admin/clients/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client
                    </Link>
                </Button>
            </div>

            {clients.length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-muted/10">
                    <p className="text-muted-foreground">No clients yet</p>
                    <Button asChild className="mt-4">
                        <Link href="/admin/clients/new">Add your first client</Link>
                    </Button>
                </div>
            ) : (
                <div className="rounded-md border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="p-4 text-left font-medium">Name</th>
                                <th className="p-4 text-left font-medium">Logo</th>
                                <th className="p-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id} className="border-b hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium">{client.name}</td>
                                    <td className="p-4">
                                        {client.logoUrl ? (
                                            <div className="relative h-8 w-24">
                                                <Image
                                                    src={client.logoUrl}
                                                    alt={client.name}
                                                    fill
                                                    className="object-contain object-left"
                                                    sizes="96px"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">No logo</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/clients/${client.id}`}>
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
