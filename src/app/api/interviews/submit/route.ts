import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let userId = session?.user?.id;

    // DEV BYPASS: Use a mock user ID if no session exists to allow testing the flow
    if (!userId) {
      console.warn('DEV BYPASS: No session found, using mock user ID');
      userId = 'dev_mock_user_id';
    }


    const body = await req.json();
    const { driveId, roundId, score, feedback } = body;

    const resultRef = adminDb.collection("InterviewResult").doc();
    const now = admin.firestore.Timestamp.now();

    await resultRef.set({
      id: resultRef.id,
      userId: userId,
      driveId,
      roundId,
      score,
      feedback,
      createdAt: now,
      updatedAt: now
    });

    // Update round progress
    const progressRef = adminDb.collection("MockRoundProgress").doc(`${userId}_${roundId}`);
    await progressRef.set({
      id: progressRef.id,
      userId: userId,
      driveId,
      roundId,
      status: 'completed',
      score,
      completedAt: now
    }, { merge: true });

    return NextResponse.json({ message: 'Interview result submitted' });
  } catch (error: any) {
    console.error('Interview submit error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
