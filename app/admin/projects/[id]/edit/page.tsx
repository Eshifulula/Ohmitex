export const dynamic = 'force-dynamic';

import { ProjectForm } from "@/components/forms/project-form";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Project</h1>
                <p className="text-muted-foreground">Update project information</p>
            </div>

            <ProjectForm projectId={id} />
        </div>
    );
}

