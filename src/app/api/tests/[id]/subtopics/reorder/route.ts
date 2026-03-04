import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// PATCH - Batch Update Orders
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { subtopics } = body;

        if (!Array.isArray(subtopics)) {
            return NextResponse.json({ error: 'Invalid payload: subtopics array required' }, { status: 400 });
        }

        const batch = adminDb.batch();
        const now = admin.firestore.Timestamp.now();

        subtopics.forEach((item: { id: string; order: number }) => {
            const subtopicRef = adminDb.collection("Subtopic").doc(item.id);
            batch.update(subtopicRef, {
                order: item.order,
                updatedAt: now
            });
        });

        await batch.commit();

        return NextResponse.json({ message: 'Order updated successfully' });
    } catch (error: any) {
        console.error('Subtopic reordering error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
