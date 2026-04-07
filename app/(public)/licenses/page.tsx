import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { Shield, ExternalLink, Code2, Lock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Open Source Licences',
    description: 'Open source software attributions and licence notices for the Ohmitex Smart Controls Ltd website.',
    robots: { index: true, follow: true },
};

// ─── Why permissive licences don't affect our proprietary code ────────────────
// All packages below use MIT, Apache 2.0, ISC, or OFL 1.1 licences.
// These are PERMISSIVE (not copyleft), meaning they allow use in proprietary
// software provided attribution is given. None are GPL/LGPL/AGPL.
// Our application code remains © Ohmitex Smart Controls Ltd — All Rights Reserved.

const licenceExplanations = [
    {
        name: 'MIT',
        colour: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        summary: 'Permission is granted to use, copy, modify and distribute freely with attribution. Compatible with proprietary software.',
    },
    {
        name: 'Apache 2.0',
        colour: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        summary: 'Like MIT but also includes an express patent grant. Requires attribution and a NOTICE for modified files. Proprietary-compatible.',
    },
    {
        name: 'ISC',
        colour: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
        summary: 'Functionally equivalent to MIT — simplified to two clauses. Freely use in any software.',
    },
    {
        name: 'OFL 1.1',
        colour: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
        summary: 'Open Font Licence. Fonts may be used freely in any software. Cannot be sold standalone as a font product.',
    },
];

interface Package {
    name: string;
    url: string;
    licence: string;
    purpose: string;
}

const packages: Package[] = [
    // Framework
    { name: 'Next.js',          url: 'https://github.com/vercel/next.js',       licence: 'MIT',        purpose: 'React framework' },
    { name: 'React',            url: 'https://github.com/facebook/react',        licence: 'MIT',        purpose: 'UI library' },
    { name: 'TypeScript',       url: 'https://github.com/microsoft/TypeScript',  licence: 'Apache 2.0', purpose: 'Type system' },
    // Database
    { name: 'Prisma',           url: 'https://github.com/prisma/prisma',         licence: 'Apache 2.0', purpose: 'Database ORM' },
    // Auth & Security
    { name: 'jose',             url: 'https://github.com/panva/jose',            licence: 'MIT',        purpose: 'JWT signing & verification' },
    { name: 'bcryptjs',         url: 'https://github.com/dcodeIO/bcrypt.js',     licence: 'MIT',        purpose: 'Password hashing' },
    { name: 'otplib',           url: 'https://github.com/yeojz/otplib',          licence: 'MIT',        purpose: 'TOTP two-factor auth' },
    { name: 'zod',              url: 'https://github.com/colinhacks/zod',        licence: 'MIT',        purpose: 'Schema validation' },
    // Styling
    { name: 'Tailwind CSS',     url: 'https://github.com/tailwindlabs/tailwindcss', licence: 'MIT',     purpose: 'Utility-first CSS framework' },
    { name: 'clsx',             url: 'https://github.com/lukeed/clsx',           licence: 'MIT',        purpose: 'Class name utility' },
    { name: 'tailwind-merge',   url: 'https://github.com/dcastil/tailwind-merge', licence: 'MIT',      purpose: 'Tailwind class merging' },
    { name: 'class-variance-authority', url: 'https://github.com/joe-bell/cva', licence: 'Apache 2.0', purpose: 'Component variant helper' },
    { name: 'tailwindcss-animate', url: 'https://github.com/jamiebuilds/tailwindcss-animate', licence: 'MIT', purpose: 'Tailwind animation plugin' },
    // Fonts
    { name: 'Outfit (Google Fonts)', url: 'https://fonts.google.com/specimen/Outfit', licence: 'OFL 1.1', purpose: 'Primary typeface' },
    // UI Primitives
    { name: 'Radix UI Primitives', url: 'https://github.com/radix-ui/primitives', licence: 'MIT',       purpose: 'Accessible UI components' },
    // Rich Text
    { name: 'Tiptap',           url: 'https://github.com/ueberdosis/tiptap',     licence: 'MIT',        purpose: 'Rich text editor (admin)' },
    // Icons
    { name: 'Lucide React',     url: 'https://github.com/lucide-icons/lucide',   licence: 'ISC',        purpose: 'Icon library' },
    // Storage & Media
    { name: 'Cloudinary SDK',   url: 'https://github.com/cloudinary/cloudinary_npm', licence: 'MIT',    purpose: 'Image & media management' },
    { name: 'AWS SDK for JS (S3)', url: 'https://github.com/aws/aws-sdk-js-v3', licence: 'Apache 2.0',  purpose: 'Object storage client' },
    { name: '@vercel/blob',     url: 'https://github.com/vercel/storage',        licence: 'Apache 2.0', purpose: 'Document storage' },
    { name: 'sharp',            url: 'https://github.com/lovell/sharp',          licence: 'Apache 2.0', purpose: 'Image processing' },
    // Email
    { name: 'Nodemailer',       url: 'https://github.com/nodemailer/nodemailer', licence: 'MIT',        purpose: 'Email dispatch' },
    // Charts
    { name: 'Chart.js',         url: 'https://github.com/chartjs/Chart.js',      licence: 'MIT',        purpose: 'Data visualisation (admin)' },
    { name: 'react-chartjs-2',  url: 'https://github.com/reactchartjs/react-chartjs-2', licence: 'MIT', purpose: 'React wrapper for Chart.js' },
    // File Uploads
    { name: 'react-dropzone',   url: 'https://github.com/react-dropzone/react-dropzone', licence: 'MIT', purpose: 'File upload UX' },
    { name: 'qrcode',           url: 'https://github.com/soldair/node-qrcode',   licence: 'MIT',        purpose: 'QR code generation for 2FA' },
    // Monitoring
    { name: 'Sentry for Next.js', url: 'https://github.com/getsentry/sentry-javascript', licence: 'MIT', purpose: 'Error monitoring' },
    // Internationalisation
    { name: 'next-intl',        url: 'https://github.com/amannn/next-intl',      licence: 'MIT',        purpose: 'Internationalisation' },
];

const licenceBadgeColour: Record<string, string> = {
    'MIT':        'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    'Apache 2.0': 'bg-blue-500/10 text-blue-700 border border-blue-500/20',
    'ISC':        'bg-violet-500/10 text-violet-700 border border-violet-500/20',
    'OFL 1.1':    'bg-orange-500/10 text-orange-700 border border-orange-500/20',
};

export default function LicencesPage() {
    return (
        <>
            <PageHero
                title="Open Source Licences"
                subtitle="This website is built on open-source software. We gratefully acknowledge every project and its contributors."
            />

            {/* Copyright notice bar */}
            <div className="border-b bg-muted/30">
                <div className="container py-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-accent" />
                        <span>Application code: <strong className="text-foreground">© {new Date().getFullYear()} Ohmitex Smart Controls Ltd — All Rights Reserved</strong></span>
                    </div>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-accent" />
                        <span>No copyleft (GPL) dependencies used</span>
                    </div>
                </div>
            </div>

            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl space-y-12">

                        {/* Why this doesn't affect our IP */}
                        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 md:p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Our Intellectual Property Is Protected</h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        All third-party packages used are licensed under <strong className="text-foreground">permissive licences</strong> (MIT, Apache 2.0, ISC, OFL 1.1) — not copyleft licences (GPL/LGPL/AGPL). Permissive licences allow free use in proprietary software. This means our application code remains our exclusive intellectual property, protected under Kenyan and international law.
                                    </p>
                                </div>
                            </div>

                            {/* Licence type legend */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {licenceExplanations.map((l) => (
                                    <div key={l.name} className={`rounded-xl border p-4 ${l.colour}`}>
                                        <div className="font-semibold text-sm mb-1">{l.name}</div>
                                        <div className="text-xs opacity-80 leading-relaxed">{l.summary}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Package table */}
                        <div>
                            <h2 className="text-xl font-bold mb-6">Acknowledgements</h2>
                            <div className="rounded-2xl border border-border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/40">
                                                <th className="text-left p-4 font-semibold text-foreground">Package</th>
                                                <th className="text-left p-4 font-semibold text-foreground">Licence</th>
                                                <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">Purpose</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {packages.map((pkg, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <a
                                                            href={pkg.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-accent transition-colors"
                                                        >
                                                            {pkg.name}
                                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                                        </a>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${licenceBadgeColour[pkg.licence] ?? ''}`}>
                                                            {pkg.licence}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-muted-foreground hidden md:table-cell">
                                                        {pkg.purpose}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Full ATTRIBUTION.md link */}
                        <div className="rounded-2xl border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Full Attribution Document</h3>
                                <p className="text-sm text-muted-foreground">
                                    The complete <code className="text-xs bg-muted px-1.5 py-0.5 rounded">ATTRIBUTION.md</code> file in our source repository contains version numbers, licence URLs, and compliance notes for every dependency.
                                </p>
                            </div>
                            <Link
                                href="/privacy-policy"
                                className="flex-shrink-0 text-sm text-accent hover:underline underline-offset-4"
                            >
                                View Privacy Policy →
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
