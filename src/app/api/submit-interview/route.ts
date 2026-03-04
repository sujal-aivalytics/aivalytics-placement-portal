import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { driveId, roundId, feedback, score, status } = body;

        if (!driveId || !roundId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const now = admin.firestore.Timestamp.now();

        // Save Interview Result / Session
        const interviewRef = adminDb.collection("InterviewSession").doc();
        await interviewRef.set({
            id: interviewRef.id,
            userId: session.user.id,
            driveId,
            roundId,
            feedback,
            score: Number(score || 0),
            status: status || 'completed',
            createdAt: now,
            updatedAt: now
        });

        // Update Round Progress
        const progressRef = adminDb.collection("MockRoundProgress").doc(`${session.user.id}_${roundId}`);
        await progressRef.set({
            id: progressRef.id,
            userId: session.user.id,
            driveId,
            roundId,
            status: status || 'completed',
            score: Number(score || 0),
            completedAt: now
        }, { merge: true });

        return NextResponse.json({ success: true, message: 'Interview submitted successfully' });

    } catch (error: any) {
        console.error('Interview submission error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
