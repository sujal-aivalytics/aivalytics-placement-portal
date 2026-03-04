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

        // Fetch enrollment for this drive
        const enrollmentSnapshot = await adminDb.collection("MockDriveEnrollment")
            .where("driveId", "==", driveId)
            .where("userId", "==", session.user.id)
            .limit(1)
            .get();

        if (enrollmentSnapshot.empty) {
            return NextResponse.json({ enrollment: null });
        }

        const enrollment = {
            id: enrollmentSnapshot.docs[0].id,
            ...enrollmentSnapshot.docs[0].data()
        };

        return NextResponse.json({ enrollment });
    } catch (error: any) {
        console.error('Progress fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
