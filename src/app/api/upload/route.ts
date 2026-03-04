import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-config';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');

        // Upload to Firebase Storage
        const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'aivalytics-8d593.firebasestorage.app';
        const bucket = adminStorage.bucket(bucketName);
        const blob = bucket.file(filename);

        // Determine content type
        const contentType = file.type || 'application/octet-stream';

        await blob.save(buffer, {
            metadata: {
                contentType: contentType,
            },
            public: true, // Make it public so we can get a direct URL
        });

        // Get the public URL. 
        // Note: Firebase Admin SDK blob.publicUrl() or direct construct
        const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        return NextResponse.json({ success: true, url });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Upload failed',
            error: error.message
        }, { status: 500 });
    }
}
