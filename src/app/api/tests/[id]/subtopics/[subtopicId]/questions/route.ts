import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';

// GET questions for a subtopic
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; subtopicId: string }> }
) {
    try {
        const { id: testId, subtopicId } = await params;

        // Verify subtopic belongs to test
        const subtopicDoc = await adminDb.collection("Subtopic").doc(subtopicId).get();
        if (!subtopicDoc.exists || subtopicDoc.data()?.testId !== testId) {
            return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
        }

        const subtopic = subtopicDoc.data() as any;

        // Get questions for this subtopic
        const questionsSnapshot = await adminDb.collection("Question")
            .where("subtopicId", "==", subtopicId)
            .orderBy("order", "asc")
            .get();

        const questions = await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
            const qData = qDoc.data() as any;

            // Join Options
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
            questions,
            subtopic: {
                id: subtopicId,
                name: subtopic.name,
                description: subtopic.description,
            }
        });
    } catch (error: any) {
        console.error('Subtopic questions fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
