export const dynamic = 'force-dynamic';

import { ClientForm } from "@/components/forms/client-form";

export default async function EditClientPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="max-w-2xl">
            <ClientForm clientId={id} />
        </div>
    );
}
