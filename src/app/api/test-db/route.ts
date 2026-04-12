import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';

export async function GET() {
    try {
        const usersSnapshot = await adminDb.collection("users").get();
        const userCount = usersSnapshot.size;
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({
            status: 'Firestore connection successful',
            userCount,
            users: users.slice(0, 5) // Return first 5 for safety
        });
    } catch (error: any) {
        return NextResponse.json({ status: 'Firestore connection failed', error: error.message }, { status: 500 });
    }
}
