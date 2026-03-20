import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Get in touch with Ohmitex Smart Controls Ltd. Call +254 725 753 008 or email info@ohmitexscontrols.co.ke. We're available Mon–Fri 8AM–6PM in Nairobi, Kenya for all automation enquiries.",
    openGraph: {
        title: "Contact Ohmitex Smart Controls Ltd | Nairobi, Kenya",
        description:
            "Reach out for a free quote on control panels, BMS, home automation or industrial automation. Based in Nairobi — serving all of Kenya.",
    },
};


export default function ContactPage() {
    return (
        <>
            <PageHero
                title="Contact Us"
                subtitle="Get in touch with our team for any inquiries or project discussions"
            />

            <section className="py-20">
                <div className="container">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Contact Form */}
                        <div>
                            <ContactForm />
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="mb-6 text-2xl font-bold">Get in Touch</h2>
                                <p className="text-muted-foreground">
                                    We&apos;d love to hear from you. Whether you have a question about our services, need a quote, or want to discuss a project, our team is ready to answer all your questions.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Email</h3>
                                        <p className="text-muted-foreground">info@ohmitexscontrols.co.ke</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Phone</h3>
                                        <p className="text-muted-foreground">+254 725 753 008</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Location</h3>
                                        <p className="text-muted-foreground">Nairobi, Kenya</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 font-medium">Business Hours</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>Mon - Fri: 8:00 AM – 6:00 PM</p>
                                    <p>Saturday & Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
