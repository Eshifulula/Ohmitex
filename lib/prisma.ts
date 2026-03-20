import { PrismaClient } from '@prisma/client';

// Cache the Prisma client in ALL environments to prevent connection pool
// exhaustion. In production (cPanel/Passenger), a new client per module
// load would quickly hit the PostgreSQL connection limit and cause 503s.
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

// Always assign — prevents multiple instances in both dev and prod
globalForPrisma.prisma = prisma;

