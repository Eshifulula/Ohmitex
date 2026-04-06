import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { FileText, CheckCircle, XCircle, Scale, Shield, AlertCircle, Zap, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Use',
    description: 'Terms of Use for Ohmitex Smart Controls Ltd website — rules governing the use of our website and services under Kenyan law.',
    robots: { index: true, follow: true },
};

const sections = [
    {
        icon: FileText,
        title: '1. Acceptance of Terms',
        content: `By accessing or using the Ohmitex Smart Controls Ltd website at ohmitexcontrols.co.ke (the "Website"), you agree to be bound by these Terms of Use ("Terms"), our Privacy Policy, and all applicable laws and regulations.

If you do not agree to these Terms, you must not use this Website. These Terms are effective from 1 January 2026 and may be updated from time to time. Your continued use of the Website after any changes constitutes your acceptance of the revised Terms.

These Terms apply to all visitors, users, and others who access or use the Website.`,
    },
    {
        icon: Zap,
        title: '2. About Our Services',
        content: `Ohmitex Smart Controls Ltd is a Kenyan engineering company specialising in:
• Automation and control systems design
• Control panel design, assembly, and commissioning
• Building Management Systems (BMS)
• Home and industrial automation
• Energy management systems
• HVAC control systems and DDC controllers

This Website is intended to:
• Provide information about our services and completed projects
• Allow potential clients to submit enquiries and contact our team
• Showcase our expertise, portfolio, and case studies

**Eligibility**
By using this Website, you confirm that you are at least 18 years of age or have the consent of a parent or guardian, and that you are legally capable of entering into binding agreements.

This Website is not intended for use by children under the age of 18, and we do not knowingly collect data from minors.`,
    },
    {
        icon: Shield,
        title: '3. Cookie Consent',
        content: `We use cookies to enhance your experience on this Website. Not all cookies are essential — some are used for analytics and marketing purposes.

When you first visit this Website, a Cookie Consent panel will appear allowing you to:
• Accept all cookies
• Reject non-essential cookies (only essential cookies will be set)
• Manage granular preferences (Essential, Analytics, Marketing)

Your preferences are saved and respected on subsequent visits. You may update your preferences at any time.

**Essential Cookies** are required for the site to function and cannot be disabled. They include security tokens, session management, and basic site functionality.

For full details on the cookies we use, please refer to Section 9 of our Privacy Policy.

By accepting analytics or marketing cookies, you consent to the associated data processing as described in our Privacy Policy.`,
    },
    {
        icon: CheckCircle,
        title: '4. Acceptable Use',
        content: `You may use this Website only for lawful purposes and in a manner consistent with these Terms. You are permitted to:
• Browse and view Website content for personal or business information purposes
• Submit genuine enquiries through our contact forms
• Share links to our Website content on social media or other platforms
• Print or download a reasonable number of pages for personal reference

You must use this Website in a responsible and respectful manner.`,
    },
    {
        icon: XCircle,
        title: '5. Prohibited Activities',
        content: `You are strictly prohibited from:

**Technical Attacks**
• Attempting to gain unauthorised access to any part of the Website, its servers, or associated systems
• Transmitting malicious code, viruses, worms, trojans, or any other harmful or disruptive code
• Conducting denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks
• Using automated tools (bots, scrapers, crawlers) to access the Website in ways that impair its performance
• Attempting SQL injection, cross-site scripting (XSS), or any other form of injection attack
• Probing or port-scanning our infrastructure

**Misuse of Content or Forms**
• Submitting false, misleading, or fraudulent contact enquiries
• Impersonating any person or entity, or falsely claiming an affiliation with any person or organisation
• Collecting or harvesting any personally identifiable information from the Website
• Using our contact forms for unsolicited commercial communications (spam)

**Legal Violations**
• Using the Website in any way that violates applicable Kenyan law or international law
• Engaging in any activity that constitutes a criminal offence or gives rise to civil liability
• Reproducing, distributing, or commercially exploiting our intellectual property without prior written consent

We reserve the right to terminate access, report violations to law enforcement authorities, and take legal action where appropriate.`,
    },
    {
        icon: FileText,
        title: '6. Intellectual Property',
        content: `All content on this Website — including but not limited to text, graphics, photographs, logos, icons, video, audio clips, data compilations, and software — is the property of Ohmitex Smart Controls Ltd or its content suppliers and is protected by Kenyan and international intellectual property laws.

You may not reproduce, distribute, modify, transmit, repost, or otherwise use any content for commercial purposes without our express written permission.

**Trademarks**
"Ohmitex Smart Controls" and the Ohmitex logo are trademarks of Ohmitex Smart Controls Ltd. Other product and company names mentioned on this Website may be trademarks of their respective owners.

**Permitted Use**
You may view, download (for non-commercial personal use), and print pages from the Website, provided you do not modify the content and retain all copyright notices.`,
    },
    {
        icon: AlertCircle,
        title: '7. Disclaimer of Warranties',
        content: `This Website and its content are provided on an "as is" and "as available" basis without any warranties, express or implied, including but not limited to:
• Warranties of merchantability or fitness for a particular purpose
• Warranties that the Website will be uninterrupted, error-free, or free of viruses
• Warranties as to the accuracy, completeness, or currentness of the content

While we strive to keep information accurate and up to date, the technical specifications, project details, and service descriptions on this Website are for general information only and should not be relied upon as the sole basis for business decisions.

**Third-Party Links**
This Website may contain links to third-party websites. These links are provided for convenience only. Ohmitex has no control over, and accepts no responsibility for, the content, privacy policies, or practices of any third-party sites.`,
    },
    {
        icon: Scale,
        title: '8. Limitation of Liability',
        content: `To the fullest extent permitted by applicable law, Ohmitex Smart Controls Ltd, its directors, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of:
• Your use of, or inability to use, this Website
• Any unauthorised access to or alteration of your data
• Any content or conduct of any third party on the Website
• Any bugs, viruses, or other harmful code transmitted through the Website

Our total liability to you for any claim arising out of or relating to these Terms or your use of the Website shall not exceed KES 5,000.

Nothing in these Terms limits our liability for fraud, fraudulent misrepresentation, death, or personal injury caused by our negligence, or any other liability that cannot be excluded by law.`,
    },
    {
        icon: Scale,
        title: '9. Governing Law & Dispute Resolution',
        content: `These Terms of Use shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its conflict of law principles.

Any dispute arising out of or in connection with these Terms — including questions about their existence, validity, or termination — shall first be subject to good-faith negotiation between the parties. If the dispute is not resolved through negotiation within 30 days, it shall be referred to and finally resolved by the courts of Kenya having appropriate jurisdiction.

If you are a consumer in the EEA, you may also be entitled to bring disputes before your local courts or alternative dispute resolution bodies.`,
    },
    {
        icon: FileText,
        title: '10. Changes to These Terms',
        content: `We reserve the right to amend these Terms at any time. Changes will be posted on this page with the updated effective date. Where changes are material, we will provide reasonable notice (e.g., a banner on the Website or an email notification where we hold your contact details).

Your continued use of the Website after any changes constitutes your acceptance of the updated Terms. If you do not agree with the revised Terms, you must stop using the Website.`,
    },
    {
        icon: Mail,
        title: '11. Contact Us',
        content: `If you have any questions regarding these Terms of Use, please contact us:

Ohmitex Smart Controls Ltd
Email: info@ohmitexcontrols.co.ke
Data/Privacy: data@ohmitexcontrols.co.ke
Phone: +254 725 753 008
Location: Nairobi, Kenya

For formal legal notices, please send correspondence to our primary email address with "Legal Notice" in the subject line.`,
    },
];

export default function TermsOfUsePage() {
    return (
        <>
            <PageHero
                title="Terms of Use"
                subtitle="Please read these terms carefully before using our website. They govern your access to and use of ohmitexcontrols.co.ke."
            />

            {/* Meta bar */}
            <div className="border-b bg-muted/30">
                <div className="container py-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-accent" />
                        <span>Effective date: <strong className="text-foreground">1 January 2026</strong></span>
                    </div>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-accent" />
                        <span>Governed by Kenyan law</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Mail className="h-4 w-4 text-accent" />
                        <a
                            href="mailto:info@ohmitexcontrols.co.ke"
                            className="hover:text-accent transition-colors font-medium"
                        >
                            info@ohmitexcontrols.co.ke
                        </a>
                    </div>
                </div>
            </div>

            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        {/* Intro card */}
                        <div className="mb-12 rounded-2xl bg-accent/5 border border-accent/10 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                                    <Scale className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-2">Terms Summary</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        These Terms of Use govern your access to and use of the Ohmitex Smart Controls
                                        Ltd website. By using this site, you agree to use it lawfully, not to attempt
                                        any form of attack or misuse, and to respect our intellectual property. Our
                                        Website is governed by Kenyan law. For the full legal text, please read all
                                        sections below.
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
                                            href={`#term-${i}`}
                                            className="text-muted-foreground hover:text-accent transition-colors"
                                        >
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Terms sections */}
                        <div className="space-y-10">
                            {sections.map((section, i) => {
                                const Icon = section.icon;
                                return (
                                    <div
                                        key={i}
                                        id={`term-${i}`}
                                        className="scroll-mt-24 rounded-2xl border border-border p-6 md:p-8 hover:border-accent/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Icon className="h-5 w-5 text-primary" />
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
                        <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-white">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Questions about these Terms?</h3>
                                    <p className="text-white/80 text-sm">
                                        If you have any legal questions or concerns about your use of our Website,
                                        please do not hesitate to get in touch.
                                    </p>
                                </div>
                                <a
                                    href="mailto:info@ohmitexcontrols.co.ke"
                                    className="flex-shrink-0 inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                                >
                                    <Mail className="h-4 w-4" />
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
