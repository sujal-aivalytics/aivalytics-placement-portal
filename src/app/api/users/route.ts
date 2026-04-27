import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// GET all users (Admin only)
export async function GET(_req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const usersSnapshot = await adminDb.collection("users").orderBy("email", "asc").get();

        const users = await Promise.all(usersSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            // Get results count for each user
            const resultsSnapshot = await adminDb.collection("Result")
                .where("userId", "==", doc.id)
                .count()
                .get();

            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                role: data.role,
                image: data.image,
                emailVerified: data.emailVerified,
                _count: {
                    results: resultsSnapshot.data().count
                }
            };
        }));

        return NextResponse.json({ users });
    } catch (error: any) {
        console.error('Users fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// PUT - Update user role (Admin only)
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!['admin', 'user'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        const userRef = adminDb.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await userRef.update({
            role,
            updatedAt: admin.firestore.Timestamp.now()
        });

        const updatedData = (await userRef.get()).data();

        return NextResponse.json({
            message: 'User role updated successfully',
            user: {
                id: userId,
                name: updatedData?.name,
                email: updatedData?.email,
                role: updatedData?.role
            }
        });
    } catch (error: any) {
        console.error('User update error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// DELETE - Delete user (Admin only)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        if (userId === session.user.id) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        // Delete user document
        await adminDb.collection("users").doc(userId).delete();

        // Optionally delete related data like results, accounts, sessions
        // For now, we follow the Prisma implementation which was a simple delete
        // (If relations have ON DELETE CASCADE in SQL, we must handle it manually in Firestore)

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('User deletion error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
