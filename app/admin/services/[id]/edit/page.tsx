export const dynamic = 'force-dynamic';

import { ServiceForm } from "@/components/forms/service-form";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Service</h1>
                <p className="text-muted-foreground">Update service information</p>
            </div>

            <ServiceForm serviceId={id} />
        </div>
    );
}

