import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File;
            if (!file) {
                return NextResponse.json({ error: 'No file provided' }, { status: 400 });
            }

            const timestamp = Date.now();
            const uniqueFileName = `${timestamp}-${file.name}`;
            
            const blob = await put(uniqueFileName, file, {
                access: 'public',
            });

            return NextResponse.json({
                publicUrl: blob.url,
                fileName: uniqueFileName,
            });
        }

        // JSON flow — client asks for a URL to upload to
        // In this architecture, it falls back to the media API which handles images via Cloudinary
        return NextResponse.json({
            uploadUrl: `/api/media`,
            publicUrl: "",
            fileName: "",
        });
    } catch (error) {
        console.error('[Upload] Error:', error);
        return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
    }
}
