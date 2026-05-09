import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
//import { adminDb } from '@/lib/firebase-config';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: driveId } = await params;
        const session = await getServerSession(authOptions);

        // Fetch Drive
        const driveDoc = await adminDb.collection("MockCompanyDrive").doc(driveId).get();
        if (!driveDoc.exists) {
            return NextResponse.json({ error: 'Mock drive not found' }, { status: 404 });
        }

        const driveData = driveDoc.data() as any;

        // Fetch Rounds
        const roundsSnapshot = await adminDb.collection("MockRound")
            .where("driveId", "==", driveId)
            .get();

        const rounds = roundsSnapshot.docs
            .map((rDoc: any) => ({ id: rDoc.id, ...rDoc.data() }))
            .sort((a: any, b: any) => (a.roundNumber || 0) - (b.roundNumber || 0));

        // Check Enrollment if logged in
        let enrollment = null;
        if (session?.user) {
            const enrollmentSnapshot = await adminDb.collection("MockDriveEnrollment")
                .where("driveId", "==", driveId)
                .where("userId", "==", session.user.id)
                .limit(1)
                .get();

            if (!enrollmentSnapshot.empty) {
                enrollment = enrollmentSnapshot.docs[0].data();
            }
        }

        return NextResponse.json({
            drive: {
                ...driveData,
                id: driveId,
                rounds,
                enrollment
            }
        });
    } catch (error: any) {
        console.error('Mock drive fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
