import { NextResponse } from 'next/server';

/**
 * GLOBAL STORAGE REDIRECT
 * This route intercepts all legacy /uploads/* requests and redirects them
 * to the Firebase Storage bucket. This fixes all 404 errors for images
 * that were migrated from local storage to the cloud.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const filename = path[path.length - 1];
    const bucket = 'aivalytics-8d593.firebasestorage.app';

    // Construct the direct Google Storage URL
    const storageUrl = `https://storage.googleapis.com/${bucket}/${filename}`;

    return NextResponse.redirect(storageUrl, { status: 301 });
}
