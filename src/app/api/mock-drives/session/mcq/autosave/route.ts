import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { enrollmentId, roundId, answers } = body;

        if (!enrollmentId || !roundId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const autosaveResult = await adminDb.runTransaction(async (transaction) => {
            // 1. Get/Upsert Round Progress
            const progressQuery = adminDb.collection("mockRoundProgress")
                .where("enrollmentId", "==", enrollmentId)
                .where("roundId", "==", roundId)
                .limit(1);

            const progressSnapshot = await transaction.get(progressQuery);
            let progressRef;
            let progressId;

            if (progressSnapshot.empty) {
                progressRef = adminDb.collection("mockRoundProgress").doc();
                progressId = progressRef.id;
                transaction.set(progressRef, {
                    id: progressId,
                    enrollmentId,
                    roundId,
                    status: 'IN_PROGRESS',
                    startedAt: admin.firestore.Timestamp.now(),
                });
            } else {
                const progressData = progressSnapshot.docs[0].data();
                if (progressData.status === 'COMPLETED') {
                    throw new Error('Round already completed');
                }
                progressRef = progressSnapshot.docs[0].ref;
                progressId = progressSnapshot.docs[0].id;
                transaction.update(progressRef, { status: 'IN_PROGRESS' });
            }

            // 2. Upsert Multiple Responses if provided
            if (answers && typeof answers === 'object') {
                for (const [qId, ans] of Object.entries(answers)) {
                    const responseQuery = adminDb.collection("mockResponse")
                        .where("roundProgressId", "==", progressId)
                        .where("questionId", "==", qId)
                        .limit(1);

                    const responseSnapshot = await transaction.get(responseQuery);
                    const responseData = {
                        roundProgressId: progressId,
                        questionId: qId,
                        answer: ans as string,
                        lastSavedAt: admin.firestore.Timestamp.now()
                    };

                    if (responseSnapshot.empty) {
                        const resRef = adminDb.collection("mockResponse").doc();
                        transaction.set(resRef, { ...responseData, id: resRef.id });
                    } else {
                        transaction.update(responseSnapshot.docs[0].ref, responseData);
                    }
                }
            }

            return { success: true };
        });

        return NextResponse.json({ ...autosaveResult, savedAt: new Date() });

    } catch (error: any) {
        console.error('MCQ Autosave Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
