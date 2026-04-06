import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    outputFileTracingRoot: __dirname,
    outputFileTracingIncludes: {
        '/**': [
            './node_modules/.prisma/**/*',
            './prisma/**/*'
        ],
    },
    serverExternalPackages: ['@prisma/client', 'bcryptjs', 'sharp'],
    images: {
        remotePatterns: [
            // Local development (MinIO)
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/ohmitex/**',
            },
            // Production — cPanel / S3-compatible storage
            {
                protocol: 'https',
                hostname: 'www.ohmitexcontrols.co.ke',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'ohmitexcontrols.co.ke',
                pathname: '/**',
            },
            // Allow any S3 / R2 / Cloudinary external storage hostname
            {
                protocol: 'https',
                hostname: '**',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        // ---------------------------------------------------------------------------
        // Shared security headers (applied to ALL routes)
        // ---------------------------------------------------------------------------
        const sharedSecurityHeaders = [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            {
                key: 'Permissions-Policy',
                value: 'camera=(), microphone=(), geolocation=(), payment=()',
            },
            {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains; preload',
            },
            // Cross-Origin policies
            { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
            { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
        ];

        // ---------------------------------------------------------------------------
        // Public CSP — no unsafe-eval; tighter than admin
        // ---------------------------------------------------------------------------
        const publicCSP = [
            "default-src 'self'",
            // No unsafe-eval on public pages
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: http://localhost:9000 https: https://res.cloudinary.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self' http://localhost:9000 https:",
            "frame-src 'self' https://www.youtube.com https://youtube.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
        ].join('; ');

        // ---------------------------------------------------------------------------
        // Admin CSP — allows unsafe-eval needed by Tiptap editor
        // ---------------------------------------------------------------------------
        const adminCSP = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: http://localhost:9000 https: https://res.cloudinary.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self' http://localhost:9000 https:",
            "frame-src 'self' https://www.youtube.com https://youtube.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; ');

        return [
            // Admin routes — permissive CSP for Tiptap
            {
                source: '/admin/:path*',
                headers: [
                    ...sharedSecurityHeaders,
                    { key: 'Content-Security-Policy', value: adminCSP },
                ],
            },
            // All other routes — strict public CSP
            {
                source: '/:path*',
                headers: [
                    ...sharedSecurityHeaders,
                    { key: 'Content-Security-Policy', value: publicCSP },
                ],
            },
        ];
    },
};

export default nextConfig;
