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
            // Allow any S3 / R2 / external storage hostname via env
            {
                protocol: 'https',
                hostname: '**',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: http://localhost:9000 https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' http://localhost:9000 https:; frame-src 'self' https://www.youtube.com https://youtube.com; frame-ancestors 'none';",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
