import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// GET - Fetch test and its questions
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId } = await params;

        const testDoc = await adminDb.collection("Test").doc(testId).get();
        if (!testDoc.exists) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        const testData = testDoc.data() as any;

        const questionsSnapshot = await adminDb.collection("Question")
            .where("testId", "==", testId)
            .orderBy("order", "asc")
            .get();

        const questions = await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
            const qData = qDoc.data() as any;
            const optionsSnapshot = await adminDb.collection("Option")
                .where("questionId", "==", qDoc.id)
                .get();

            return {
                id: qDoc.id,
                ...qData,
                options: optionsSnapshot.docs.map(oDoc => ({ id: oDoc.id, ...oDoc.data() }))
            };
        }));

        return NextResponse.json({
            test: {
                id: testId,
                title: testData.title,
                company: testData.company,
                description: testData.description,
            },
            questions,
        });
    } catch (error: any) {
        console.error('Error fetching test questions:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// POST - Add a question to a test
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId } = await params;
        const body = await req.json();
        const { text, type = 'multiple-choice', marks = 1, options, metadata, subtopicId } = body;

        if (!text) {
            return NextResponse.json({ error: 'Question text is required' }, { status: 400 });
        }

        const testDoc = await adminDb.collection("Test").doc(testId).get();
        if (!testDoc.exists) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        let finalSubtopicId = subtopicId;
        if (!finalSubtopicId) {
            const subtopicsSnapshot = await adminDb.collection("Subtopic")
                .where("testId", "==", testId)
                .orderBy("order", "asc")
                .limit(1)
                .get();
            if (!subtopicsSnapshot.empty) {
                finalSubtopicId = subtopicsSnapshot.docs[0].id;
            }
        }

        const batch = adminDb.batch();
        const questionRef = adminDb.collection("Question").doc();
        const now = admin.firestore.Timestamp.now();

        const questionData = {
            id: questionRef.id,
            testId,
            subtopicId: finalSubtopicId || null,
            text,
            type,
            marks: Number(marks),
            metadata: metadata || null,
            createdAt: now,
            updatedAt: now,
            order: 0
        };

        batch.set(questionRef, questionData);

        const createdOptions: any[] = [];
        if ((type === 'mcq' || type === 'multiple-choice') && Array.isArray(options)) {
            options.forEach((opt: { text: string; isCorrect: boolean }) => {
                const optRef = adminDb.collection("Option").doc();
                const optData = {
                    id: optRef.id,
                    questionId: questionRef.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect || false,
                    createdAt: now
                };
                batch.set(optRef, optData);
                createdOptions.push(optData);
            });
        }

        await batch.commit();

        return NextResponse.json(
            { message: 'Question added successfully', question: { ...questionData, options: createdOptions } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Question creation error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// DELETE - Remove a question from a test
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId } = await params;
        const { searchParams } = new URL(req.url);
        const questionId = searchParams.get('questionId');

        if (!questionId) {
            return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
        }

        const questionDoc = await adminDb.collection("Question").doc(questionId).get();
        if (!questionDoc.exists || questionDoc.data()?.testId !== testId) {
            return NextResponse.json({ error: 'Question not found in this test' }, { status: 404 });
        }

        const batch = adminDb.batch();
        batch.delete(adminDb.collection("Question").doc(questionId));

        const optionsSnapshot = await adminDb.collection("Option").where("questionId", "==", questionId).get();
        optionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        await batch.commit();

        return NextResponse.json({ message: 'Question deleted successfully' });
    } catch (error: any) {
        console.error('Question deletion error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// PUT - Update a question
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId } = await params;
        const body = await req.json();
        const { id: questionId, text, type, marks, options, metadata, subtopicId } = body;

        if (!questionId) {
            return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
        }

        const questionDoc = await adminDb.collection("Question").doc(questionId).get();
        if (!questionDoc.exists || questionDoc.data()?.testId !== testId) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        const now = admin.firestore.Timestamp.now();
        const batch = adminDb.batch();

        const updateData: any = {
            text: text !== undefined ? text : questionDoc.data()?.text,
            type: type !== undefined ? type : questionDoc.data()?.type,
            marks: marks !== undefined ? Number(marks) : questionDoc.data()?.marks,
            metadata: metadata !== undefined ? metadata : questionDoc.data()?.metadata,
            subtopicId: subtopicId !== undefined ? subtopicId : questionDoc.data()?.subtopicId,
            updatedAt: now
        };

        batch.update(adminDb.collection("Question").doc(questionId), updateData);

        if (Array.isArray(options)) {
            const optionsSnapshot = await adminDb.collection("Option").where("questionId", "==", questionId).get();
            optionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

            options.forEach((opt: { text: string; isCorrect: boolean }) => {
                const optRef = adminDb.collection("Option").doc();
                batch.set(optRef, {
                    id: optRef.id,
                    questionId: questionId,
                    text: opt.text,
                    isCorrect: opt.isCorrect || false,
                    createdAt: now
                });
            });
        }

        await batch.commit();

        return NextResponse.json({ message: 'Question updated successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Question update error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
