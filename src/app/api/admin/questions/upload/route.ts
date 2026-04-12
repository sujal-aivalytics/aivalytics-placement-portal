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

        let successCount = 0;
        let currentBatch = adminDb.batch();
        let operationCount = 0;
        const now = admin.firestore.Timestamp.now();

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
            const questionRef = adminDb.collection("Question").doc();

            const questionData: any = {
                id: questionRef.id,
                testId,
                text: q.question || q.text || "Untitled Question",
                type: q.type || 'multiple-choice',
                marks: parseInt(q.marks || '1'),
                explanation: q.explanation || null,
                difficulty: q.difficulty || 'Medium',
                category: q.category || null,
                createdAt: now,
                updatedAt: now
            };

            if (subtopicId) {
                questionData.subtopicId = subtopicId;
            }

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
                
                const optRef = adminDb.collection("Option").doc();
                currentBatch.set(optRef, {
                    id: optRef.id,
                    questionId: questionRef.id,
                    text: String(opt.text),
                    isCorrect: isCorrect(q.correct_option || q.correct_index, opt.index),
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

        return NextResponse.json({ message: `Successfully uploaded ${successCount} questions` });
    } catch (error: any) {
        console.error('Global upload error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
