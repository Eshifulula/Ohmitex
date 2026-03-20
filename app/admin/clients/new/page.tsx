export const dynamic = 'force-dynamic'

import { ClientForm } from "@/components/forms/client-form";

export default function NewClientPage() {
    return (
        <div className="max-w-2xl">
            <ClientForm />
        </div>
    );
}
