import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// GET - Round details
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { roundId } = await params;

        const roundDoc = await adminDb.collection("MockRound").doc(roundId).get();
        if (!roundDoc.exists) {
            return NextResponse.json({ error: 'Round not found' }, { status: 404 });
        }

        const roundData = roundDoc.data() as any;

        // Fetch questions for this round
        const questionsSnapshot = await adminDb.collection("MockQuestion")
            .where("roundId", "==", roundId)
            // .orderBy("order", "asc") // No order field yet, skipping for now
            .get();

        const questions = questionsSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            round: {
                ...roundData,
                id: roundDoc.id,
                questions
            }
        });
    } catch (error: any) {
        console.error('Round fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// DELETE - Remove a round
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { roundId } = await params;

        // Cleanup: delete questions associated with this round
        const questionsSnapshot = await adminDb.collection("MockQuestion").where("roundId", "==", roundId).get();
        const batch = adminDb.batch();
        questionsSnapshot.docs.forEach((doc: any) => batch.delete(doc.ref));

        // Delete the round itself
        batch.delete(adminDb.collection("MockRound").doc(roundId));

        await batch.commit();

        return NextResponse.json({ message: 'Round deleted successfully' });
    } catch (error: any) {
        console.error('Round deletion error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// PATCH - Update round details
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { roundId } = await params;
        const body = await req.json();
        const { title, type, roundNumber } = body;

        const roundRef = adminDb.collection("MockRound").doc(roundId);
        const roundDoc = await roundRef.get();

        if (!roundDoc.exists) {
            return NextResponse.json({ error: 'Round not found' }, { status: 404 });
        }

        const updateData: any = {
            updatedAt: admin.firestore.Timestamp.now()
        };
        if (title !== undefined) updateData.title = title;
        if (type !== undefined) updateData.type = type;
        if (roundNumber !== undefined) updateData.roundNumber = Number(roundNumber);

        await roundRef.update(updateData);

        return NextResponse.json({ message: 'Round updated successfully' });
    } catch (error: any) {
        console.error('Round update error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
