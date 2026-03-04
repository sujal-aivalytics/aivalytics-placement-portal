import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; stageName: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: placementId, stageName } = await params;

        // Fetch application/enrollment for this placement
        const applicationsSnapshot = await adminDb.collection("PlacementApplication")
            .where("placementId", "==", placementId)
            .where("userId", "==", session.user.id)
            .limit(1)
            .get();

        if (applicationsSnapshot.empty) {
            return NextResponse.json({ error: 'No active application found' }, { status: 404 });
        }

        const application = applicationsSnapshot.docs[0].data() as any;

        // Map stageName to test category or specific test requirement
        const placementDoc = await adminDb.collection("Placement").doc(placementId).get();
        const placementData = placementDoc.data() as any;
        const companyName = placementData?.company;

        const testsSnapshot = await adminDb.collection("Test")
            .where("company", "==", companyName)
            .limit(1)
            .get();

        if (testsSnapshot.empty) {
            return NextResponse.json({ error: 'No associated test found for this stage' }, { status: 404 });
        }

        const testId = testsSnapshot.docs[0].id;

        // Fetch questions for this test
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
            stage: stageName,
            testId: testId,
            questions: questions.sort(() => Math.random() - 0.5).slice(0, 10) // Mock random selection
        });
    } catch (error: any) {
        console.error('Placement stage questions error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
