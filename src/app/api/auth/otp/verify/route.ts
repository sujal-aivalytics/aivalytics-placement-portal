import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const otpDoc = await adminDb.collection("OneTimePassword").doc(email).get();

        if (!otpDoc.exists) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        const otpData = otpDoc.data() as any;

        // Check if expired
        if (otpData.expiresAt.toDate() < new Date()) {
            await adminDb.collection("OneTimePassword").doc(email).delete();
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        }

        // Check if OTP matches (constant-time comparison to prevent timing attacks)
        const providedBuffer = Buffer.from(otp);
        const storedBuffer = Buffer.from(otpData.otp);

        if (providedBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(providedBuffer, storedBuffer)) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Success - delete OTP
        await adminDb.collection("OneTimePassword").doc(email).delete();

        return NextResponse.json({ message: 'OTP verified successfully' });
    } catch (error: any) {
        console.error('OTP verify error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
