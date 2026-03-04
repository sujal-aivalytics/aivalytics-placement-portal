import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const userSnapshot = await adminDb.collection("User")
            .where("email", "==", email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = userSnapshot.docs[0].data();

        return NextResponse.json({
            message: 'User found',
            user: {
                id: userSnapshot.docs[0].id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('Test login error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
