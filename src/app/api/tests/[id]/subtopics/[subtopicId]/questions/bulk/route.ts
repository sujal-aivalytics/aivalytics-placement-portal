import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string; subtopicId: string }> }
) {
    try {
        const { id: testId, subtopicId } = await params;
        const body = await req.json();
        const { questions } = body;

        if (!questions || !Array.isArray(questions)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        let successCount = 0;
        let currentBatch = adminDb.batch();
        let operationCount = 0;
        const now = admin.firestore.Timestamp.now();

        for (const q of questions) {
            const questionRef = adminDb.collection("Question").doc();
            const questionData = {
                id: questionRef.id,
                testId: testId,
                subtopicId: subtopicId,
                text: q.text,
                type: q.type || 'multiple-choice',
                marks: parseInt(q.marks || q.points || '1'),
                metadata: q.metadata || null,
                order: successCount,
                createdAt: now,
                updatedAt: now
            };

            currentBatch.set(questionRef, questionData);
            operationCount++;

            if (q.options && Array.isArray(q.options)) {
                for (const o of q.options) {
                    const optRef = adminDb.collection("Option").doc();
                    currentBatch.set(optRef, {
                        id: optRef.id,
                        questionId: questionRef.id,
                        text: o.text,
                        isCorrect: o.isCorrect,
                        createdAt: now
                    });
                    operationCount++;

                    if (operationCount >= 450) {
                        await currentBatch.commit();
                        currentBatch = adminDb.batch();
                        operationCount = 0;
                    }
                }
            }

            successCount++;

            if (operationCount >= 450) {
                await currentBatch.commit();
                currentBatch = adminDb.batch();
                operationCount = 0;
            }
        }

        if (operationCount > 0) {
            await currentBatch.commit();
        }

        return NextResponse.json({ success: true, count: successCount });

    } catch (error: any) {
        console.error("Subtopic Bulk Import Error:", error);
        return NextResponse.json({ error: "Failed to import questions to subtopic", details: error.message }, { status: 500 });
    }
}
