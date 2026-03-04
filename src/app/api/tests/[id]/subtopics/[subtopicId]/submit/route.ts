import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// POST - Submit subtopic test
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string; subtopicId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId, subtopicId } = await params;
        const { answers, timeSpent, proctoringData } = await req.json();

        // Verify subtopic belongs to test
        const subtopicDoc = await adminDb.collection("Subtopic").doc(subtopicId).get();
        if (!subtopicDoc.exists || subtopicDoc.data()?.testId !== testId) {
            return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
        }

        // Fetch questions and options for this subtopic
        const questionsSnapshot = await adminDb.collection("Question")
            .where("subtopicId", "==", subtopicId)
            .get();

        let score = 0;
        const total = questionsSnapshot.docs.length;

        await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
            const userAnswer = answers[qDoc.id];
            const optionsSnapshot = await adminDb.collection("Option")
                .where("questionId", "==", qDoc.id)
                .where("isCorrect", "==", true)
                .limit(1)
                .get();

            const correctOption = optionsSnapshot.empty ? null : optionsSnapshot.docs[0].data();

            if (userAnswer && correctOption && userAnswer === correctOption.text) {
                score++;
            }
        }));

        const percentage = total > 0 ? (score / total) * 100 : 0;

        const batch = adminDb.batch();

        // Save or update user progress
        const progressSnapshot = await adminDb.collection("UserSubtopicProgress")
            .where("userId", "==", session.user.id)
            .where("subtopicId", "==", subtopicId)
            .limit(1)
            .get();

        let progressRef;
        const progressData = {
            userId: session.user.id,
            subtopicId,
            score,
            total,
            percentage,
            attempted: true,
            completed: true,
            answers: JSON.stringify(answers),
            timeSpent,
            updatedAt: admin.firestore.Timestamp.now()
        };

        if (progressSnapshot.empty) {
            progressRef = adminDb.collection("UserSubtopicProgress").doc();
            batch.set(progressRef, { ...progressData, id: progressRef.id, createdAt: admin.firestore.Timestamp.now() });
        } else {
            progressRef = progressSnapshot.docs[0].ref;
            batch.update(progressRef, progressData);
        }

        // Log proctoring violations
        if (proctoringData?.violations?.length > 0) {
            proctoringData.violations.forEach((v: any) => {
                const eventRef = adminDb.collection("MonitoringEvent").doc();
                batch.set(eventRef, {
                    id: eventRef.id,
                    userId: session.user.id,
                    eventType: `violation_${v.type}`,
                    violationType: v.type,
                    details: JSON.stringify(v.metadata || {}),
                    timestamp: admin.firestore.Timestamp.fromDate(new Date(v.timestamp)),
                    testType: `subtopic_${subtopicId}`
                });
            });
        }

        await batch.commit();

        return NextResponse.json({
            message: 'Subtopic test submitted successfully',
            result: {
                score,
                total,
                percentage,
                progress: { ...progressData, id: progressRef.id }
            },
        });
    } catch (error: any) {
        console.error('Subtopic submission error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
