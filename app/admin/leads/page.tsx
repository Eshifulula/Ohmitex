export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";

export default async function AdminLeadsPage() {
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Leads</h1>
                <p className="text-muted-foreground">View contact form submissions</p>
            </div>

            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-4 text-left font-medium">Name</th>
                            <th className="p-4 text-left font-medium">Email</th>
                            <th className="p-4 text-left font-medium">Company</th>
                            <th className="p-4 text-left font-medium">Date</th>
                            <th className="p-4 text-right font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id} className="border-b">
                                <td className="p-4">{lead.name}</td>
                                <td className="p-4 text-muted-foreground">{lead.email}</td>
                                <td className="p-4 text-muted-foreground">
                                    {lead.company || "—"}
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                        {lead.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No leads yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
