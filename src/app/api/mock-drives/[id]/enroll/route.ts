import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId } = await params;

        // Check if drive exists
        const driveDoc = await adminDb.collection("MockCompanyDrive").doc(driveId).get();
        if (!driveDoc.exists) {
            return NextResponse.json({ error: 'Mock drive not found' }, { status: 404 });
        }

        // Check existing enrollment
        const existingSnapshot = await adminDb.collection("MockDriveEnrollment")
            .where("driveId", "==", driveId)
            .where("userId", "==", session.user.id)
            .get();

        if (!existingSnapshot.empty) {
            return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
        }

        // Create enrollment
        const enrollmentRef = adminDb.collection("MockDriveEnrollment").doc(`${session.user.id}_${driveId}`);
        const now = admin.firestore.Timestamp.now();

        await enrollmentRef.set({
            id: enrollmentRef.id,
            userId: session.user.id,
            driveId,
            status: 'enrolled',
            createdAt: now,
            updatedAt: now
        });

        return NextResponse.json({ message: 'Enrolled successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Enrollment error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
