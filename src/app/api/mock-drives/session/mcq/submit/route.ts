import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import { generateMCQEvaluation } from '@/lib/assessment-ai';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { enrollmentId, roundId, answers } = body;

        if (!enrollmentId || !roundId || !answers) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 1. Fetch Round and Questions
        const roundDoc = await adminDb.collection("MockRound").doc(roundId).get();
        if (!roundDoc.exists) {
            return NextResponse.json({ error: 'Round not found' }, { status: 404 });
        }
        const roundData = roundDoc.data() as any;

        const questionsSnapshot = await adminDb.collection("MockQuestion")
            .where("roundId", "==", roundId)
            .get();

        const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

        const responsesData: any[] = [];
        let score = 0;
        let correctCount = 0;
        const totalQuestionsCount = questions.length;
        const categoryResults: Record<string, { correct: number; total: number }> = {};

        questions.forEach(q => {
            const category = "General";
            if (!categoryResults[category]) {
                categoryResults[category] = { correct: 0, total: 0 };
            }
            categoryResults[category].total++;

            const selectedOptionId = answers[q.id];
            let options = q.options;
            if (typeof options === 'string') {
                try { options = JSON.parse(options); } catch (e) { options = []; }
            }

            let isCorrect = false;

            const selectedOption = (options as any[]).find((opt: any, idx: number) => {
                const optId = opt.id || `opt-${idx}`;
                return selectedOptionId === optId || selectedOptionId === opt.text;
            });

            if (selectedOption?.isCorrect) {
                isCorrect = true;
                score += (q.points || 0);
                correctCount++;
                categoryResults[category].correct++;
            }

            responsesData.push({
                questionId: q.id,
                answer: selectedOptionId || "",
                isCorrect,
                score: isCorrect ? (q.points || 0) : 0
            });
        });

        const percentage = totalQuestionsCount > 0 ? (correctCount / totalQuestionsCount) * 100 : 0;
        const normalizedScore = percentage;
        const isPassed = percentage >= 60;

        // Generate AI Evaluation
        const aiEvaluation = await generateMCQEvaluation(
            percentage,
            questions.length,
            categoryResults,
            roundData.title || 'MCQ Round'
        );

        // Transaction for atomic updates
        await adminDb.runTransaction(async (transaction) => {
            // Check for existing Round Progress
            const progressQuery = adminDb.collection("MockRoundProgress")
                .where("enrollmentId", "==", enrollmentId)
                .where("roundId", "==", roundId)
                .limit(1);

            const progressSnapshot = await transaction.get(progressQuery);
            let progressRef;
            let progressId;

            if (progressSnapshot.empty) {
                progressRef = adminDb.collection("MockRoundProgress").doc();
                progressId = progressRef.id;
                transaction.set(progressRef, {
                    id: progressId,
                    enrollmentId,
                    roundId,
                    status: isPassed ? 'COMPLETED' : 'FAILED',
                    score: normalizedScore,
                    totalQuestions: questions.length,
                    answeredQuestions: Object.keys(answers).length,
                    startedAt: admin.firestore.Timestamp.now(),
                    completedAt: admin.firestore.Timestamp.now(),
                    aiFeedback: JSON.stringify(aiEvaluation)
                });
            } else {
                progressRef = progressSnapshot.docs[0].ref;
                progressId = progressRef.id;
                transaction.update(progressRef, {
                    status: isPassed ? 'COMPLETED' : 'FAILED',
                    score: normalizedScore,
                    totalQuestions: questions.length,
                    answeredQuestions: Object.keys(answers).length,
                    completedAt: admin.firestore.Timestamp.now(),
                    aiFeedback: JSON.stringify(aiEvaluation)
                });
            }

            // Clear old responses (Firestore batch/deleteMany equivalent in transaction)
            const oldResponsesSnapshot = await adminDb.collection("MockResponse").where("roundProgressId", "==", progressId).get();
            oldResponsesSnapshot.docs.forEach(doc => transaction.delete(doc.ref));

            // Insert New Responses
            responsesData.forEach(r => {
                const resRef = adminDb.collection("MockResponse").doc();
                transaction.set(resRef, { ...r, id: resRef.id, roundProgressId: progressId });
            });

            // Update Enrollment
            const enrollmentRef = adminDb.collection("MockDriveEnrollment").doc(enrollmentId);
            const enrollmentDoc = await transaction.get(enrollmentRef);

            if (enrollmentDoc.exists) {
                const enrollment = enrollmentDoc.data() as any;

                // Need to know total rounds count - fetch outside or inside? Inside is safer.
                const roundsSnapshot = await adminDb.collection("MockRound").where("driveId", "==", enrollment.driveId).get();
                const totalRounds = roundsSnapshot.size;
                const currentRound = enrollment.currentRoundNumber || 1;
                const isLastRound = currentRound >= totalRounds;

                if (isPassed) {
                    const updatedOverallScore = (((enrollment.overallScore || 0) * (currentRound - 1)) + normalizedScore) / currentRound;

                    transaction.update(enrollmentRef, {
                        currentRoundNumber: isLastRound ? currentRound : currentRound + 1,
                        overallScore: updatedOverallScore,
                        status: isLastRound ? 'PASSED' : 'IN_PROGRESS',
                        updatedAt: admin.firestore.Timestamp.now()
                    });
                } else {
                    transaction.update(enrollmentRef, {
                        status: 'FAILED',
                        updatedAt: admin.firestore.Timestamp.now()
                    });
                }
            }
        });

        return NextResponse.json({ success: true, score, isPassed });

    } catch (error: any) {
        console.error('MCQ Submit Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
