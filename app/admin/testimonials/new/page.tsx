export const dynamic = 'force-dynamic'

import { TestimonialForm } from "@/components/forms/testimonial-form";

export default function NewTestimonialPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Add Testimonial</h1>
                <p className="text-muted-foreground">Create a new client testimonial</p>
            </div>

            <TestimonialForm />
        </div>
    );
}
