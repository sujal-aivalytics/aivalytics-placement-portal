import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

interface Option {
    text: string;
    isCorrect: boolean;
}

interface RequestQuestion {
    text: string;
    type?: string;
    metadata?: string;
    options: Option[];
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId } = await params;
        const body = await req.json();
        const { questions, subtopicId } = body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json({ error: 'Questions array is required' }, { status: 400 });
        }

        // Validate question format
        for (const q of questions) {
            const isCoding = q.type === 'coding';
            if (!q.text) return NextResponse.json({ error: 'Each question must have text' }, { status: 400 });

            if (!isCoding) {
                if (!Array.isArray(q.options) || q.options.length < 2) {
                    return NextResponse.json({ error: 'MCQ questions must have at least 2 options' }, { status: 400 });
                }
                const correctOptions = q.options.filter((o: Option) => o.isCorrect);
                if (correctOptions.length !== 1) {
                    return NextResponse.json({ error: 'MCQ questions must have exactly one correct option' }, { status: 400 });
                }
            }
        }

        let successCount = 0;
        let currentBatch = adminDb.batch();
        let operationCount = 0;
        const now = admin.firestore.Timestamp.now();

        // Fetch current question count for ordering
        const questionsSnapshot = await adminDb.collection("Question")
            .where("testId", "==", testId)
            .get();
        let currentOrder = questionsSnapshot.size;

        for (const q of questions) {
            const questionRef = adminDb.collection("Question").doc();
            const questionData = {
                id: questionRef.id,
                testId,
                subtopicId: subtopicId || null,
                text: q.text,
                type: q.type || 'multiple-choice',
                metadata: q.metadata || null,
                order: currentOrder++,
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
                        isCorrect: o.isCorrect || false,
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

        return NextResponse.json({
            success: true,
            count: successCount,
        });
    } catch (error: any) {
        console.error('Error creating bulk questions:', error);
        return NextResponse.json({ error: 'Failed to create questions', details: error.message }, { status: 500 });
    }
}
