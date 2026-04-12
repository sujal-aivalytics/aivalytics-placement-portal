import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// POST: Create a new question
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { testId, text, type, category, difficulty, metadata, options } = body;

        if (!testId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const batch = adminDb.batch();
        const questionRef = adminDb.collection("questions").doc();

        const questionData = {
            id: questionRef.id,
            testId,
            text,
            type: type || 'multiple-choice',
            category: category || null,
            difficulty: difficulty || null,
            metadata: metadata ? JSON.stringify(metadata) : null,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        };

        batch.set(questionRef, questionData);

        if (options && Array.isArray(options)) {
            options.forEach((opt: any) => {
                const optRef = adminDb.collection("options").doc();
                batch.set(optRef, {
                    id: optRef.id,
                    questionId: questionRef.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect || false
                });
            });
        }

        await batch.commit();

        // Fetch options to return
        const optionsSnapshot = await adminDb.collection("options").where("questionId", "==", questionRef.id).get();
        const freshOptions = optionsSnapshot.docs.map(doc => doc.data());

        return NextResponse.json({
            message: 'Question created',
            question: { ...questionData, options: freshOptions }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create Question Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

// DELETE: Delete a question
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
        }

        const batch = adminDb.batch();

        // Delete options first
        const optionsSnapshot = await adminDb.collection("options").where("questionId", "==", id).get();
        optionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        // Delete question
        batch.delete(adminDb.collection("questions").doc(id));

        await batch.commit();

        return NextResponse.json({ message: 'Question deleted successfully' });
    } catch (error: any) {
        console.error('Delete Question Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

// PUT: Update an existing question
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, text, type, category, difficulty, metadata, options } = body;

        if (!id || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const batch = adminDb.batch();
        const questionRef = adminDb.collection("questions").doc(id);

        batch.update(questionRef, {
            text,
            type: type || 'multiple-choice',
            category: category || null,
            difficulty: difficulty || null,
            metadata: metadata ? JSON.stringify(metadata) : null,
            updatedAt: admin.firestore.Timestamp.now()
        });

        if (options && Array.isArray(options)) {
            // Delete existing options
            const existingOptionsSnapshot = await adminDb.collection("options").where("questionId", "==", id).get();
            existingOptionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

            // Create new options
            options.forEach((opt: any) => {
                const optRef = adminDb.collection("options").doc();
                batch.set(optRef, {
                    id: optRef.id,
                    questionId: id,
                    text: opt.text,
                    isCorrect: opt.isCorrect || false
                });
            });
        }

        await batch.commit();

        // Fetch fresh data
        const freshQuestionDoc = await questionRef.get();
        const freshOptionsSnapshot = await adminDb.collection("options").where("questionId", "==", id).get();

        return NextResponse.json({
            message: 'Question updated',
            question: {
                ...freshQuestionDoc.data(),
                id: freshQuestionDoc.id,
                options: freshOptionsSnapshot.docs.map(doc => doc.data())
            }
        });
    } catch (error: any) {
        console.error('Update Question Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
