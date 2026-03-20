export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ClientsGrid } from "@/components/sections/clients-grid";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
    title: "Our Clients",
    description:
        "Ohmitex Smart Controls Ltd is trusted by leading Kenyan organisations including Gertrude's Hospital, Aga Khan University Hospital, Sarit Centre, KUTTRH, AGC Tenwek Hospital and more.",
    openGraph: {
        title: "Trusted Clients | Ohmitex Smart Controls Ltd Kenya",
        description:
            "Serving top hospitals, commercial centres and engineering firms across Kenya. See who trusts Ohmitex Smart Controls for their automation needs.",
    },
};


export default async function ClientsPage() {
    const clients = await prisma.client.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <>
            <PageHero
                title="Our Clients"
                subtitle="Trusted partners who rely on our expertise for their automation needs"
            />

            <ClientsGrid clients={clients} />
        </>
    );
}
