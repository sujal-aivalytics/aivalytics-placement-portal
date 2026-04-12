import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// GET all tests or a specific test
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const testId = searchParams.get('id');

        if (testId) {
            // Get specific test
            const testDoc = await adminDb.collection("Test").doc(testId).get();
            if (!testDoc.exists) {
                return NextResponse.json({ error: 'Test not found' }, { status: 404 });
            }

            const testData = testDoc.data();

            // Get questions for this test
            const questionsSnapshot = await adminDb.collection("Question")
                .where("testId", "==", testId)
                .get();

            let questions = await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
                const qData = qDoc.data();
                // Get options for each question
                const optionsSnapshot = await adminDb.collection("options")
                    .where("questionId", "==", qDoc.id)
                    .get();

                return {
                    ...qData,
                    id: qDoc.id,
                    options: optionsSnapshot.docs.map(oDoc => ({ ...oDoc.data(), id: oDoc.id }))
                };
            }));

            // In-memory sort by 'order'
            (questions as any[]).sort((a, b) => (a.order || 0) - (b.order || 0));

            return NextResponse.json({
                test: { ...testData, id: testDoc.id, questions }
            });
        } else {
            // Get all tests
            const type = searchParams.get('type');
            const excludeType = searchParams.get('exclude_type');

            let query: any = adminDb.collection("Test");
            if (type) {
                query = query.where("type", "==", type);
            } else if (excludeType) {
                // Firestore doesn't have a direct 'not' operator but since we only have a few types...
                // Alternatively, we filter in JS
            }

            const testsSnapshot = await query.get();
            let tests = testsSnapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({ ...doc.data(), id: doc.id }));

            if (excludeType) {
                tests = tests.filter((t: any) => t.type !== excludeType);
            }

            // In-memory sort by createdAt (descending) as default to avoid composite index requirements
            tests.sort((a: any, b: any) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });

            // For each test, get the question count
            // (In a real app, we should store questionCount on the Test document)
            const testsWithCount = await Promise.all(tests.map(async (test: any) => {
                const countSnapshot = await adminDb.collection("Question")
                    .where("testId", "==", test.id)
                    .count()
                    .get();
                return {
                    ...test,
                    _count: { questions: countSnapshot.data().count }
                };
            }));

            return NextResponse.json({ tests: testsWithCount });
        }
    } catch (error: any) {
        console.error('Tests fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// POST - Create a new test (Admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, duration, difficulty, questions, type, company, topic } = body;

        if (!title || !duration || !difficulty) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const batch = adminDb.batch();
        const testRef = adminDb.collection("Test").doc();

        const testData = {
            title,
            description,
            duration: parseInt(duration),
            difficulty,
            type: type || 'topic',
            company: company || null,
            topic: topic || null,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        };

        batch.set(testRef, testData);

        if (questions && Array.isArray(questions)) {
            questions.forEach((q, qIndex) => {
                const qRef = adminDb.collection("Question").doc();
                batch.set(qRef, {
                    testId: testRef.id,
                    text: q.text,
                    type: q.type || 'multiple-choice',
                    category: q.category || null,
                    difficulty: q.difficulty || null,
                    order: q.order || qIndex,
                    marks: q.marks || 1,
                    createdAt: admin.firestore.Timestamp.now()
                });

                if (q.options && Array.isArray(q.options)) {
                    q.options.forEach((opt: any) => {
                        const optRef = adminDb.collection("options").doc();
                        batch.set(optRef, {
                            questionId: qRef.id,
                            text: opt.text,
                            isCorrect: opt.isCorrect || false
                        });
                    });
                }
            });
        }

        await batch.commit();

        return NextResponse.json(
            { message: 'Test created successfully', id: testRef.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Test creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create test', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const testId = searchParams.get('id');

        if (!testId) {
            return NextResponse.json({ error: 'Test ID required' }, { status: 400 });
        }

        // In Firestore, deleting a document doesn't delete sub-collections or "related" docs in other collections
        // We need to manually delete questions and options (or use a cloud function / recursive delete)
        // For now, let's just delete the Test doc (cascading deletes should be handled)

        // Simple manual cascade for questions and their options
        const questionsSnapshot = await adminDb.collection("Question").where("testId", "==", testId).get();
        const batch = adminDb.batch();

        for (const qDoc of questionsSnapshot.docs) {
            const optionsSnapshot = await adminDb.collection("options").where("questionId", "==", qDoc.id).get();
            optionsSnapshot.docs.forEach(oDoc => batch.delete(oDoc.ref));
            batch.delete(qDoc.ref);
        }

        batch.delete(adminDb.collection("Test").doc(testId));
        await batch.commit();

        return NextResponse.json({ message: 'Test deleted successfully' });
    } catch (error: any) {
        console.error('Test deletion error:', error);
        return NextResponse.json(
            { error: 'Failed to delete test', details: error.message },
            { status: 500 }
        );
    }
}
