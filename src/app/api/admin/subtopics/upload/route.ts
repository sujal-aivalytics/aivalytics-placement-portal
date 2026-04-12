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

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const testId = formData.get('testId') as string;
        const subtopicId = formData.get('subtopicId') as string;

        if (!file || !testId) {
            return NextResponse.json({ error: 'Missing file or testId' }, { status: 400 });
        }

        // Parse CSV using xlsx
        const buffer = await file.arrayBuffer();
        const workbook = (await import('xlsx')).read(buffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const questions = (await import('xlsx')).utils.sheet_to_json(worksheet) as any[];

        if (!Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json({ error: 'Empty or invalid CSV file' }, { status: 400 });
        }

        const now = admin.firestore.Timestamp.now();

        // 1. Validate subtopic
        const subtopicDoc = await adminDb.collection("subtopics").doc(subtopicId).get();
        if (!subtopicDoc.exists) {
            return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
        }
        const subtopicName = subtopicDoc.data()?.name || 'Subtopic';

        // 2. Upload Questions in Batches
        let successCount = 0;
        let currentBatch = adminDb.batch();
        let operationCount = 0;

        const isCorrect = (val: any, index: number) => {
            if (!val) return false;
            const sVal = String(val).toUpperCase();
            if (sVal === String(index)) return true;
            if (sVal === 'A' && index === 1) return true;
            if (sVal === 'B' && index === 2) return true;
            if (sVal === 'C' && index === 3) return true;
            if (sVal === 'D' && index === 4) return true;
            return false;
        };

        for (const q of questions) {
            const questionRef = adminDb.collection("questions").doc();

            const questionData = {
                id: questionRef.id,
                testId,
                subtopicId,
                text: q.question || q.text || "Untitled Question",
                type: q.type || 'multiple-choice',
                marks: parseInt(q.marks || '1'),
                explanation: q.explanation || null,
                difficulty: q.difficulty || 'Medium',
                category: q.category || null,
                createdAt: now,
                updatedAt: now
            };

            currentBatch.set(questionRef, questionData);
            operationCount++;

            // Process Options from CSV columns
            const optionsData = [
                { text: q.option_1, index: 1 },
                { text: q.option_2, index: 2 },
                { text: q.option_3, index: 3 },
                { text: q.option_4, index: 4 }
            ];

            for (const opt of optionsData) {
                if (!opt.text) continue;
                
                const optRef = adminDb.collection("options").doc();
                currentBatch.set(optRef, {
                    id: optRef.id,
                    questionId: questionRef.id,
                    text: String(opt.text),
                    isCorrect: isCorrect(q.correct_option, opt.index),
                    createdAt: now
                });
                operationCount++;

                if (operationCount >= 450) {
                    await currentBatch.commit();
                    currentBatch = adminDb.batch();
                    operationCount = 0;
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
