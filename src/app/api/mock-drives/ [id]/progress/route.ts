import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId } = await params;

        // Fetch user progress for this drive
        const progressSnapshot = await adminDb.collection("MockRoundProgress")
            .where("driveId", "==", driveId)
            .where("userId", "==", session.user.id)
            .get();

        const progress = progressSnapshot.docs.reduce((acc: any, doc) => {
            const data = doc.data();
            acc[data.roundId] = {
                status: data.status,
                score: data.score,
                completedAt: data.completedAt
            };
            return acc;
        }, {});

        return NextResponse.json(progress);
    } catch (error: any) {
        console.error('Progress fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
