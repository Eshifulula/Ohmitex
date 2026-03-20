import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ohmitexcontrols.co.ke"),
    title: {
        default: "Ohmitex Smart Controls Ltd | Automation & Control Systems Kenya",
        template: "%s | Ohmitex Smart Controls Ltd",
    },
    description:
        "Kenya's leading automation and smart control systems company. We design, assemble and commission control panels, BMS, home automation, energy management and industrial automation solutions in Nairobi.",
    keywords: [
        "automation company Kenya", "control panels Nairobi", "building management system Kenya",
        "BMS Kenya", "home automation Kenya", "industrial automation Nairobi",
        "energy management system Kenya", "DDC controllers Kenya", "MCC panels Kenya",
        "smart controls Kenya", "Ohmitex Smart Controls", "HVAC control panels Kenya",
        "PLC control systems Kenya", "electrical engineering Nairobi",
    ],
    authors: [{ name: "Ohmitex Smart Controls Ltd", url: "https://ohmitexcontrols.co.ke" }],
    creator: "Ohmitex Smart Controls Ltd",
    publisher: "Ohmitex Smart Controls Ltd",
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    openGraph: {
        type: "website",
        locale: "en_KE",
        url: "https://ohmitexcontrols.co.ke",
        siteName: "Ohmitex Smart Controls Ltd",
        title: "Ohmitex Smart Controls Ltd | Automation & Control Systems Kenya",
        description:
            "Kenya's leading automation company. Control panels, BMS, home automation and industrial automation solutions in Nairobi.",
        images: [{ url: "/images/logo.png", width: 400, height: 200, alt: "Ohmitex Smart Controls Ltd" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Ohmitex Smart Controls Ltd | Automation & Control Systems Kenya",
        description:
            "Kenya's leading automation company. Control panels, BMS, home automation and industrial automation solutions in Nairobi.",
        images: ["/images/logo.png"],
    },
    manifest: "/manifest.json",
    appleWebApp: { capable: true, statusBarStyle: "default", title: "Ohmitex" },
    formatDetection: { telephone: true },
};

export const viewport: Viewport = {
    themeColor: "#0D1C33",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className={`${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
                {children}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js').then(
                                        function(registration) {
                                            console.log('Service Worker registered with scope:', registration.scope);
                                        },
                                        function(err) {
                                            console.log('Service Worker registration failed:', err);
                                        }
                                    );
                                });
                            }
                        `,
                    }}
                />
            </body>
        </html>
    );
}

