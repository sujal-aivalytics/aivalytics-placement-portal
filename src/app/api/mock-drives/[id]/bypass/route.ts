import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId } = await params;
        const body = await req.json();
        const { userId, roundId, status, score } = body;

        if (!userId || !roundId) {
            return NextResponse.json({ error: 'User ID and Round ID are required' }, { status: 400 });
        }

        const now = admin.firestore.Timestamp.now();

        // Check enrollment
        const enrollmentRef = adminDb.collection("MockDriveEnrollment").doc(`${userId}_${driveId}`);
        const enrollmentDoc = await enrollmentRef.get();

        if (!enrollmentDoc.exists) {
            return NextResponse.json({ error: 'User not enrolled in this drive' }, { status: 404 });
        }

        // Update / Create Round Progress
        const progressRef = adminDb.collection("MockRoundProgress").doc(`${userId}_${roundId}`);
        await progressRef.set({
            id: progressRef.id,
            userId,
            driveId,
            roundId,
            status: status || 'completed',
            score: Number(score || 100),
            completedAt: now
        }, { merge: true });

        return NextResponse.json({ message: 'Round bypassed/updated successfully' });
    } catch (error: any) {
        console.error('Bypass error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
