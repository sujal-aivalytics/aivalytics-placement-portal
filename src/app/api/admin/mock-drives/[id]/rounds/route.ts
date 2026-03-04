import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// POST - Create a new round for a mock drive
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId } = await params;
        const body = await req.json();
        const { title, type } = body;

        if (!title || !type) {
            return NextResponse.json({ error: 'Title and type are required' }, { status: 400 });
        }

        // Determine round number
        const roundsSnapshot = await adminDb.collection("MockRound")
            .where("driveId", "==", driveId)
            .get();

        const roundNumber = roundsSnapshot.size + 1;

        const roundRef = adminDb.collection("MockRound").doc();
        const now = admin.firestore.Timestamp.now();

        const roundData = {
            id: roundRef.id,
            driveId,
            title,
            type, // 'mcq', 'interview', 'coding'
            roundNumber,
            createdAt: now,
            updatedAt: now
        };

        await roundRef.set(roundData);

        return NextResponse.json(roundData, { status: 201 });
    } catch (error: any) {
        console.error('Round creation error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
