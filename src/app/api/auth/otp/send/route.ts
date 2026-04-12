import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Use email as doc ID to easily find/overwrite existing OTP for this email
        await adminDb.collection("OneTimePassword").doc(email).set({
            email,
            otp,
            expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
            createdAt: admin.firestore.Timestamp.now()
        });

        // In a real app, send email here
        // console.log(`OTP for ${email}: ${otp}`); // Safety: Never log secrets in production

        return NextResponse.json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('OTP send error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
