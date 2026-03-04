import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { enrollmentId, roundId, type, message } = await req.json();

        if (!enrollmentId || !type) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const progressQuery = adminDb.collection("MockRoundProgress")
            .where("enrollmentId", "==", enrollmentId)
            .where("roundId", "==", roundId)
            .limit(1);

        const progressSnapshot = await progressQuery.get();

        if (!progressSnapshot.empty) {
            const progressDoc = progressSnapshot.docs[0];
            const progress = progressDoc.data() as any;

            await progressDoc.ref.update({
                proctoringLogs: (progress.proctoringLogs ? progress.proctoringLogs + '\n' : '') + `[${new Date().toISOString()}] ${type}: ${message}`,
                updatedAt: admin.firestore.Timestamp.now()
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Violation Log Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
