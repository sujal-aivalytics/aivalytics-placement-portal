import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId, roundId } = await params;
        const body = await req.json();
        const { questions } = body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json({ error: 'Questions array is required' }, { status: 400 });
        }

        let successCount = 0;
        let currentBatch = adminDb.batch();
        let operationCount = 0;
        const now = admin.firestore.Timestamp.now();

        for (const q of questions) {
            const questionRef = adminDb.collection("MockQuestion").doc();

            const questionData = {
                id: questionRef.id,
                roundId,
                driveId,
                text: q.text,
                type: q.type || 'multiple-choice',
                metadata: typeof q.metadata === 'object' ? JSON.stringify(q.metadata) : (q.metadata || null),
                createdAt: now,
                updatedAt: now
            };

            currentBatch.set(questionRef, questionData);
            operationCount++;

            if (operationCount >= 450) {
                await currentBatch.commit();
                currentBatch = adminDb.batch();
                operationCount = 0;
            }
            successCount++;
        }

        if (operationCount > 0) {
            await currentBatch.commit();
        }

        return NextResponse.json({ message: `Successfully uploaded ${successCount} questions` });
    } catch (error: any) {
        console.error('Bulk upload error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
