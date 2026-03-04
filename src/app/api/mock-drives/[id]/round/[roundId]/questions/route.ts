import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { roundId } = await params;

        // Fetch round details
        const roundDoc = await adminDb.collection("MockRound").doc(roundId).get();
        if (!roundDoc.exists) {
            return NextResponse.json({ error: 'Round not found' }, { status: 404 });
        }

        // Fetch questions for this round
        const questionsSnapshot = await adminDb.collection("MockQuestion")
            .where("roundId", "==", roundId)
            .get();

        const questions = questionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            round: roundDoc.data(),
            questions
        });
    } catch (error: any) {
        console.error('Mock round questions fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
