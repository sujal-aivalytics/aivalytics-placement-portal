import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

// GET - Fetch individual mock drive details
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId } = await params;

        // Fetch drive
        const driveDoc = await adminDb.collection("MockCompanyDrive").doc(driveId).get();
        if (!driveDoc.exists) {
            return NextResponse.json({ error: 'Mock drive not found' }, { status: 404 });
        }

        const driveData = driveDoc.data() as any;

        // Fetch rounds for this drive
        const roundsSnapshot = await adminDb.collection("MockRound")
            .where("driveId", "==", driveId)
            .get();

        const rounds = await Promise.all(roundsSnapshot.docs
            .map((rDoc: any) => ({ id: rDoc.id, ...(rDoc.data() as any) }))
            .sort((a: any, b: any) => (a.roundNumber || 0) - (b.roundNumber || 0))
            .map(async (rData: any) => {
                // Fetch questions count for each round
                const questionsSnapshot = await adminDb.collection("MockQuestion")
                    .where("roundId", "==", rData.id)
                    .get();

                return {
                    ...rData,
                    questions: Array(questionsSnapshot.size).fill({}),
                    _count: {
                        questions: questionsSnapshot.size
                    }
                };
            }));

        return NextResponse.json({
            drive: {
                ...driveData,
                id: driveId,
                rounds,
            }
        });
    } catch (error: any) {
        console.error('Error fetching admin mock drive:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// DELETE - Remove a mock drive
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId } = await params;

        await adminDb.collection("MockCompanyDrive").doc(driveId).delete();

        return NextResponse.json({ message: 'Drive deleted successfully' });
    } catch (error: any) {
        console.error('Drive deletion error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
