import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const testDoc = await adminDb.collection("Test").doc(id).get();
        if (!testDoc.exists) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        const testData = testDoc.data() as any;

        // Join Subtopics
        const subtopicsSnapshot = await adminDb.collection("Subtopic")
            .where("testId", "==", id)
            .get();

        const subtopics = subtopicsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        // Join Questions
        const questionsSnapshot = await adminDb.collection("Question")
            .where("testId", "==", id)
            .get();

        const questions = await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
            const qData = qDoc.data() as any;

            // Join Options
            const optionsSnapshot = await adminDb.collection("Option")
                .where("questionId", "==", qDoc.id)
                .get();

            // Join Subtopic (already fetched, can find in subtopics array)
            const subtopic = subtopics.find(s => s.id === qData.subtopicId);

            return {
                id: qDoc.id,
                ...qData,
                options: optionsSnapshot.docs.map(oDoc => ({ id: oDoc.id, ...oDoc.data() })),
                subtopic: subtopic || null
            };
        }));

        // Sort questions in-memory
        questions.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        return NextResponse.json({
            ...testData,
            id: testDoc.id,
            subtopics,
            questions
        });
    } catch (error: any) {
        console.error("Error fetching test:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { id } = await params;

        // In Firestore, cascading delete isn't automatic
        await adminDb.collection("Test").doc(id).delete();

        return NextResponse.json({ message: 'Test deleted successfully' });
    } catch (error: any) {
        console.error("Error deleting test:", error);
        return NextResponse.json({
            error: 'Failed to delete test',
            details: error.message
        }, { status: 500 });
    }
}
