export const dynamic = 'force-dynamic'

import { ServiceForm } from "@/components/forms/service-form";

export default function NewServicePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Create Service</h1>
                <p className="text-muted-foreground">Add a new service to your portfolio</p>
            </div>

            <ServiceForm />
        </div>
    );
}
