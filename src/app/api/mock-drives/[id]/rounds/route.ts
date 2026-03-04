import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch rounds for the drive
        const roundsSnapshot = await adminDb.collection("MockRound")
            .where("driveId", "==", id)
            .get();

        const rounds = roundsSnapshot.docs
            .map((doc: any) => ({ id: doc.id, ...doc.data() }))
            .sort((a: any, b: any) => (a.roundNumber || 0) - (b.roundNumber || 0));

        return NextResponse.json({ rounds });
    } catch (error: any) {
        console.error('Error fetching mock drive rounds:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
