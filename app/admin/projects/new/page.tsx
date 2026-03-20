export const dynamic = 'force-dynamic'

import { ProjectForm } from "@/components/forms/project-form";

export default function NewProjectPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Create Project</h1>
                <p className="text-muted-foreground">Add a new project to your portfolio</p>
            </div>

            <ProjectForm />
        </div>
    );
}
