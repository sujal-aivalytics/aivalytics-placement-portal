import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { testId, subtopicName, questions } = body;

        if (!testId || !subtopicName || !Array.isArray(questions)) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // 1. Find or Create Subtopic
        const subtopicsSnapshot = await adminDb.collection("Subtopic")
            .where("testId", "==", testId)
            .where("name", "==", subtopicName)
            .limit(1)
            .get();

        let subtopicId;
        const now = admin.firestore.Timestamp.now();

        if (subtopicsSnapshot.empty) {
            const subtopicRef = adminDb.collection("Subtopic").doc();
            subtopicId = subtopicRef.id;
            await subtopicRef.set({
                id: subtopicId,
                testId,
                name: subtopicName,
                order: 0, // Default order
                createdAt: now,
                updatedAt: now
            });
        } else {
            subtopicId = subtopicsSnapshot.docs[0].id;
        }

        // 2. Upload Questions in Batches
        let successCount = 0;
        let currentBatch = adminDb.batch();
        let operationCount = 0;

        for (const q of questions) {
            const questionRef = adminDb.collection("Question").doc();

            const questionData = {
                id: questionRef.id,
                testId,
                subtopicId,
                text: q.text,
                type: q.type || 'multiple-choice',
                marks: parseInt(q.marks || '1'),
                metadata: q.metadata || null,
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

        return NextResponse.json({ message: `Successfully uploaded ${successCount} questions to ${subtopicName}` });
    } catch (error: any) {
        console.error('Subtopic upload error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
