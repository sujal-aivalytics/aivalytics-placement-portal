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
        const { testId, answers, timeSpent, driveId, roundId } = body;

        if (!testId || !answers) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch Test
        const testDoc = await adminDb.collection("Test").doc(testId).get();
        if (!testDoc.exists) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        const testData = testDoc.data() as any;

        // Fetch Questions and Options for validation/scoring
        const questionsSnapshot = await adminDb.collection("Question")
            .where("testId", "==", testId)
            .get();

        const questionsWithCorrect = await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
            const qData = qDoc.data() as any;
            const correctOptionSnapshot = await adminDb.collection("Option")
                .where("questionId", "==", qDoc.id)
                .where("isCorrect", "==", true)
                .limit(1)
                .get();

            return {
                id: qDoc.id,
                correctOptionId: correctOptionSnapshot.empty ? null : correctOptionSnapshot.docs[0].id,
                marks: qData.marks || 1
            };
        }));

        // Scoring
        let score = 0;
        let totalPossible = 0;
        const processedAnswers = questionsWithCorrect.map(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctOptionId;
            if (isCorrect) score += q.marks;
            totalPossible += q.marks;
            return {
                questionId: q.id,
                userAnswerId: userAnswer,
                isCorrect
            };
        });

        const percentage = (score / totalPossible) * 100;

        // Save Result
        const resultRef = adminDb.collection("Result").doc();
        const now = admin.firestore.Timestamp.now();

        const resultData = {
            id: resultRef.id,
            userId: session.user.id,
            testId,
            score,
            percentage,
            timeSpent,
            responses: JSON.stringify(processedAnswers),
            createdAt: now,
            updatedAt: now
        };

        await resultRef.set(resultData);

        // Update Round Progress if part of a Mock Drive
        if (driveId && roundId) {
            const progressRef = adminDb.collection("MockRoundProgress").doc(`${session.user.id}_${roundId}`);
            await progressRef.set({
                id: progressRef.id,
                userId: session.user.id,
                driveId,
                roundId,
                status: 'completed',
                score: percentage,
                completedAt: now
            }, { merge: true });
        }

        return NextResponse.json({
            success: true,
            score,
            percentage,
            resultId: resultRef.id
        });

    } catch (error: any) {
        console.error('Test submission error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
