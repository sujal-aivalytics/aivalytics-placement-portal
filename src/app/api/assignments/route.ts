import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as admin from 'firebase-admin';
import { adminDb } from '@/lib/firebase-config';

// GET - List assignments (Admin check or user check)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const testId = searchParams.get('testId');

        let query = adminDb.collection("TestAssignment") as admin.firestore.Query;

        if (session.user.role === 'admin') {
            if (userId) query = query.where("userId", "==", userId);
            if (testId) query = query.where("testId", "==", testId);
        } else {
            query = query.where("userId", "==", session.user.id);
        }

        const snapshot = await query.orderBy("createdAt", "desc").get();

        const assignments = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Join Test
            const testDoc = await adminDb.collection("Test").doc(data.testId).get();
            const testData = testDoc.data();

            // Join User
            const userDoc = await adminDb.collection("User").doc(data.userId).get();
            const userData = userDoc.data();

            return {
                id: doc.id,
                ...data,
                test: testData ? { id: testDoc.id, title: testData.title } : null,
                user: userData ? { id: userDoc.id, name: userData.name, email: userData.email } : null
            };
        }));

        return NextResponse.json(assignments);
    } catch (error: any) {
        console.error('Assignments fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// POST - Create or Bulk create assignments
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { userId, testId, userIds } = body; // Support single or bulk

        const now = admin.firestore.Timestamp.now();
        const batch = adminDb.batch();

        if (Array.isArray(userIds) && testId) {
            userIds.forEach((uId: string) => {
                const ref = adminDb.collection("TestAssignment").doc(`${uId}_${testId}`);
                batch.set(ref, {
                    id: `${uId}_${testId}`,
                    userId: uId,
                    testId,
                    status: 'assigned',
                    createdAt: now,
                    updatedAt: now
                }, { merge: true });
            });
        } else if (userId && testId) {
            const ref = adminDb.collection("TestAssignment").doc(`${userId}_${testId}`);
            batch.set(ref, {
                id: `${userId}_${testId}`,
                userId,
                testId,
                status: 'assigned',
                createdAt: now,
                updatedAt: now
            }, { merge: true });
        } else {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        await batch.commit();

        return NextResponse.json({ message: 'Assignment(s) created successfully' });
    } catch (error: any) {
        console.error('Assignment creation error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// DELETE - Remove an assignment
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 });
        }

        await adminDb.collection("TestAssignment").doc(id).delete();

        return NextResponse.json({ message: 'Assignment deleted successfully' });
    } catch (error: any) {
        console.error('Assignment deletion error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
