export const dynamic = 'force-dynamic';

import { TestimonialForm } from "@/components/forms/testimonial-form";

interface EditTestimonialPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Testimonial</h1>
                <p className="text-muted-foreground">Update testimonial details</p>
            </div>

            <TestimonialForm testimonialId={id} />
        </div>
    );
}
