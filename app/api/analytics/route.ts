import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// POST - Track a page view (public, no auth required)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path } = body;

        if (!path) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }

        // Get referrer and user agent from headers
        const referrer = request.headers.get('referer') || null;
        const userAgent = request.headers.get('user-agent') || null;

        // Create page view record
        await prisma.pageView.create({
            data: {
                path,
                referrer,
                userAgent,
                // country could be extracted from IP using a geo service
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Page view tracking error:', error);
        return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 });
    }
}

// GET - Get analytics data (admin only)
export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days') || '7');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get page view counts by path
        const pageViews = await prisma.pageView.groupBy({
            by: ['path'],
            where: {
                createdAt: { gte: startDate },
            },
            _count: { path: true },
            orderBy: { _count: { path: 'desc' } },
            take: 20,
        });

        // Get total views
        const totalViews = await prisma.pageView.count({
            where: { createdAt: { gte: startDate } },
        });

        // Get views by day
        const viewsByDay = await prisma.$queryRaw`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM "PageView"
            WHERE created_at >= ${startDate}
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `;

        return NextResponse.json({
            totalViews,
            topPages: pageViews.map(pv => ({
                path: pv.path,
                views: pv._count.path,
            })),
            viewsByDay,
        });
    } catch (error) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
