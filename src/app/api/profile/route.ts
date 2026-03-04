import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// GET - Fetch user profile
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userDoc = await adminDb.collection("User").doc(session.user.id).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data() as any;

        // Fetch optional counts or related data
        const resultsSnapshot = await adminDb.collection("Result")
            .where("userId", "==", session.user.id)
            .get();

        return NextResponse.json({
            ...userData,
            id: userDoc.id,
            _count: {
                results: resultsSnapshot.size
            }
        });
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// PATCH - Update user profile
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, image, phone, college, department, yearOfGraduation } = body;

        const now = admin.firestore.Timestamp.now();
        const updateData: any = {
            updatedAt: now
        };

        if (name !== undefined) updateData.name = name;
        if (image !== undefined) updateData.image = image;
        if (phone !== undefined) updateData.phone = phone;
        if (college !== undefined) updateData.college = college;
        if (department !== undefined) updateData.department = department;
        if (yearOfGraduation !== undefined) updateData.yearOfGraduation = yearOfGraduation;

        await adminDb.collection("User").doc(session.user.id).update(updateData);

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
