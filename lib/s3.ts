import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Lazy singleton — only created when actually needed, so a missing env var
// won't crash the whole server on startup.
let _s3Client: S3Client | null = null;

function getS3Client(): S3Client {
    if (_s3Client) return _s3Client;

    const endpoint = process.env.S3_ENDPOINT;
    const accessKeyId = process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.S3_SECRET_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        throw new Error(
            '[S3] Missing required environment variables: S3_ENDPOINT, S3_ACCESS_KEY, or S3_SECRET_KEY. ' +
            'File upload features will not work until these are configured.'
        );
    }

    _s3Client = new S3Client({
        endpoint,
        region: process.env.S3_REGION || 'us-east-1',
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true, // Required for MinIO / cPanel S3-compatible storage
    });

    return _s3Client;
}

export async function generateUploadUrl(fileName: string): Promise<string> {
    const client = getS3Client();
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: fileName,
    });
    return getSignedUrl(client, command, { expiresIn: 3600 });
}

export function getPublicUrl(fileName: string): string {
    return `${process.env.S3_PUBLIC_URL}/${fileName}`;
}

