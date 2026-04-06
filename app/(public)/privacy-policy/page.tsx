import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { Shield, Mail, Eye, Lock, Users, Globe, FileText, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Ohmitex Smart Controls Ltd Privacy Policy — how we collect, use, and protect your personal data in accordance with the Kenya Data Protection Act 2019 and GDPR.',
    robots: { index: true, follow: true },
};

const sections = [
    {
        icon: FileText,
        title: '1. Introduction',
        content: `Ohmitex Smart Controls Ltd ("Ohmitex", "we", "us", or "our") is committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at ohmitexcontrols.co.ke or contact us through any of our channels.

This Policy is effective from 1 January 2026 and complies with:
• The Kenya Data Protection Act, 2019 (DPA 2019)
• The European Union General Data Protection Regulation (GDPR) — applicable to visitors from the European Economic Area (EEA)
• Any other applicable data protection legislation

By using our website, you acknowledge that you have read and understood this Privacy Policy.`,
    },
    {
        icon: Users,
        title: '2. Data Controller',
        content: `Ohmitex Smart Controls Ltd is the data controller responsible for your personal data.

Company: Ohmitex Smart Controls Ltd
Location: Nairobi, Kenya
Email: info@ohmitexcontrols.co.ke
Data Protection Contact: data@ohmitexcontrols.co.ke
Phone: +254 725 753 008

If you are an EEA resident and have questions about this Policy or wish to exercise your GDPR rights, please contact us at data@ohmitexcontrols.co.ke.`,
    },
    {
        icon: Eye,
        title: '3. Information We Collect',
        content: `We collect only the minimum information necessary to provide our services. The categories of personal data we may collect include:

**Information You Provide Directly**
• Contact details: name, email address, phone number
• Company name and business information
• Messages and enquiries submitted through our contact form
• Any other information you voluntarily provide

**Information Collected Automatically**
• IP address and approximate geographic location
• Browser type, version, and language settings
• Operating system and device type
• Pages visited, time spent on pages, and referring URLs
• Date and time of your visit

**Cookies and Tracking Technologies**
We use cookies as described in Section 9 below. You can manage your cookie preferences at any time using our Cookie Preferences panel.

We do NOT collect:
• Payment card details (we do not process online payments)
• Sensitive personal data (health, biometric, racial/ethnic origin)
• Data from children under 18 years of age`,
    },
    {
        icon: Shield,
        title: '4. How We Use Your Information',
        content: `We process your personal data for the following purposes and under these legal bases:

**Service Delivery** (Legitimate Interest / Contract Performance)
• Responding to your enquiries and providing quotations
• Communicating about projects, services, and updates
• Sending service-related notifications

**Business Operations** (Legitimate Interest)
• Analysing website usage to improve our services
• Monitoring website security and preventing fraud
• Maintaining business records as required by Kenyan law

**Marketing** (Consent — where required)
• Sending newsletters or marketing communications about our services
• You may unsubscribe from marketing at any time

**Legal Compliance** (Legal Obligation)
• Complying with applicable laws, court orders, or regulatory requirements

We will not use your personal data for automated decision-making or profiling that produces legal or similarly significant effects without your explicit consent.`,
    },
    {
        icon: Globe,
        title: '5. Data Sharing and Disclosure',
        content: `We do not sell, rent, or trade your personal data. We may share your information with:

**Service Providers** (Data Processors)
We engage trusted third-party providers who process data on our behalf under strict data processing agreements:
• Cloudinary (Cloudinary Ltd) — image and media storage, servers in the United States (SCCs/adequacy mechanisms applied)
• Email service providers — for transactional and notification emails
• Hosting and infrastructure providers — for website and application hosting

**Legal Disclosures**
We may disclose your information where required by law, court order, or to protect the rights, property, or safety of Ohmitex, our customers, or the public.

**Business Transfers**
In the event of a merger, acquisition, or sale of assets, your personal data may be transferred as part of that transaction. We will notify you before your data is subjected to a different privacy policy.

We require all third parties to respect the security of your personal data and to treat it in accordance with applicable data protection laws.`,
    },
    {
        icon: Lock,
        title: '6. Data Security',
        content: `We implement appropriate technical and organisational security measures to protect your personal data from unauthorised access, loss, destruction, alteration, or disclosure. These measures include:

• HTTPS / TLS encryption for all data in transit
• HTTP-Only, Secure, SameSite cookies for session management
• Strong password hashing (bcrypt) for stored credentials
• Content Security Policy (CSP) and security headers to protect against XSS and injection attacks
• Rate limiting and device fingerprinting to detect and prevent abuse
• Web Application Firewall (WAF) rules in our middleware
• Input validation and sanitisation on all forms and APIs
• Regular security reviews and access controls

While we take all reasonable precautions, no method of electronic transmission or storage is 100% secure. In the unlikely event of a data breach affecting your rights and freedoms, we will notify you and the relevant supervisory authority as required by law.`,
    },
    {
        icon: Globe,
        title: '7. International Data Transfers',
        content: `Your personal data may be transferred to and processed in countries outside Kenya, including the United States (Cloudinary). Where such transfers occur, we ensure appropriate safeguards are in place as required by the Kenya DPA 2019 and EU GDPR, including:

• European Commission Standard Contractual Clauses (SCCs)
• Adequacy decisions recognised by the relevant data protection authority
• Other appropriate legal mechanisms

By submitting your information to us, you agree to these transfers where applicable.`,
    },
    {
        icon: Users,
        title: '8. Your Rights',
        content: `Depending on your location, you may have the following rights regarding your personal data:

**Under the Kenya Data Protection Act, 2019 (All Kenyan Residents)**
• Right to be informed — know what data we hold and how we use it
• Right of access — obtain a copy of your personal data
• Right to rectification — correct inaccurate data
• Right to erasure — request deletion of your data
• Right to object — object to certain processing activities
• Right to data portability — receive your data in a portable format

**Additional Rights Under GDPR (EEA Residents)**
• Right to restrict processing
• Right not to be subject to solely automated decision-making
• Right to lodge a complaint with your local supervisory authority

To exercise any of these rights, please contact us at:
data@ohmitexcontrols.co.ke

We will respond to your request within 30 days. We may need to verify your identity before processing your request.`,
    },
    {
        icon: Eye,
        title: '9. Cookies Policy',
        content: `We use cookies and similar tracking technologies to enhance your experience on our website.

**Types of Cookies We Use**

Essential Cookies (Always Active)
These are necessary for the website to function properly. They include session management, security tokens, and basic functionality. They cannot be disabled.

Analytics Cookies (With Your Consent)
We may use analytics tools (e.g., Google Analytics) to understand how visitors use our site — which pages are most popular, how long visitors stay, and how they navigate. This data is anonymous and aggregated.

Marketing Cookies (With Your Consent)
These may be set by our advertising partners to build a profile of your interests. They do not store personal information directly.

**Managing Cookies**
When you first visit our website, you will be asked for your cookie preferences. You can change your preferences at any time using the Cookie Preferences option. You can also control cookies through your browser settings, though this may impact website functionality.

For more on cookies, visit: www.allaboutcookies.org`,
    },
    {
        icon: FileText,
        title: '10. Data Retention',
        content: `We retain your personal data only for as long as necessary to fulfil the purposes described in this Policy, or as required by law:

• Contact enquiries: 3 years from last contact
• Project records: 7 years (as required by Kenyan tax and company law)
• Website analytics data: 26 months (anonymised thereafter)
• Marketing preferences: Until you unsubscribe or withdraw consent
• Cookie consent records: 1 year

When data is no longer needed, we securely delete or anonymise it.`,
    },
    {
        icon: AlertCircle,
        title: '11. Changes to This Policy',
        content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons. We will indicate the "Effective Date" at the top of this page. Where changes are material, we will notify you by email or by placing a prominent notice on our website.

We encourage you to review this Policy periodically to stay informed about how we protect your data.`,
    },
    {
        icon: Mail,
        title: '12. Contact Us',
        content: `For any questions, concerns, or requests relating to this Privacy Policy or your personal data, please contact our Data Protection team:

Email: data@ohmitexcontrols.co.ke
General enquiries: info@ohmitexcontrols.co.ke
Phone: +254 725 753 008
Address: Nairobi, Kenya

If you believe we have not addressed your concern adequately, you have the right to lodge a complaint with the Office of the Data Protection Commissioner (ODPC) in Kenya, or with the relevant supervisory authority in your country of residence (for EEA residents).

Kenya ODPC: www.odpc.go.ke`,
    },
];

export default function PrivacyPolicyPage() {
    return (
        <>
            <PageHero
                title="Privacy Policy"
                subtitle="Your privacy matters to us. Here's how we collect, use, and protect your information."
            />

            {/* Effective date banner */}
            <div className="border-b bg-muted/30">
                <div className="container py-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-accent" />
                        <span>Effective date: <strong className="text-foreground">1 January 2026</strong></span>
                    </div>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <span>Compliant with Kenya DPA 2019 &amp; GDPR</span>
                    <div className="ml-auto flex items-center gap-2">
                        <Mail className="h-4 w-4 text-accent" />
                        <a
                            href="mailto:data@ohmitexcontrols.co.ke"
                            className="hover:text-accent transition-colors font-medium"
                        >
                            data@ohmitexcontrols.co.ke
                        </a>
                    </div>
                </div>
            </div>

            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        {/* Intro card */}
                        <div className="mb-12 rounded-2xl bg-primary/5 border border-primary/10 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-2">Our Commitment to Privacy</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Ohmitex Smart Controls Ltd is committed to being transparent about the data
                                        we collect about you, what we use it for, and who we share it with. We
                                        collect only what we need, keep it secure, and give you full control
                                        over your personal information.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Table of contents */}
                        <div className="mb-12 rounded-2xl border border-border p-6">
                            <h2 className="text-base font-bold mb-4 text-foreground">Contents</h2>
                            <ol className="space-y-1.5 text-sm">
                                {sections.map((s, i) => (
                                    <li key={i}>
                                        <a
                                            href={`#section-${i}`}
                                            className="text-muted-foreground hover:text-accent transition-colors"
                                        >
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Policy sections */}
                        <div className="space-y-10">
                            {sections.map((section, i) => {
                                const Icon = section.icon;
                                return (
                                    <div
                                        key={i}
                                        id={`section-${i}`}
                                        className="scroll-mt-24 rounded-2xl border border-border p-6 md:p-8 hover:border-accent/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                                <Icon className="h-5 w-5 text-accent" />
                                            </div>
                                            <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                                        </div>
                                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line space-y-3">
                                            {section.content.split('\n\n').map((paragraph, j) => (
                                                <p key={j}>{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA */}
                        <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center text-white">
                            <Mail className="h-8 w-8 mx-auto mb-3 text-accent" />
                            <h3 className="text-xl font-bold mb-2">Questions about your data?</h3>
                            <p className="text-white/80 text-sm mb-4">
                                Our Data Protection team is here to help with any questions or data requests.
                            </p>
                            <a
                                href="mailto:data@ohmitexcontrols.co.ke"
                                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                            >
                                <Mail className="h-4 w-4" />
                                data@ohmitexcontrols.co.ke
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
