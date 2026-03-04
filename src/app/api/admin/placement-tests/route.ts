import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// GET - List all placement-specific tests
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const testsSnapshot = await adminDb.collection("Test").get();
        const tests = testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(tests);
    } catch (error: any) {
        console.error('Placement tests fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// POST - Create or Update a placement test
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, title, company, description, category, duration, passingMarks, totalMarks, eligibilityCriteria } = body;

        const now = admin.firestore.Timestamp.now();
        const testData: any = {
            title,
            company,
            description,
            category,
            duration: Number(duration),
            passingMarks: Number(passingMarks),
            totalMarks: Number(totalMarks),
            eligibilityCriteria: eligibilityCriteria || null,
            updatedAt: now
        };

        if (id) {
            // Update
            await adminDb.collection("Test").doc(id).update(testData);
            return NextResponse.json({ id, ...testData, message: 'Test updated successfully' });
        } else {
            // Create
            const testRef = adminDb.collection("Test").doc();
            testData.id = testRef.id;
            testData.createdAt = now;
            await testRef.set(testData);
            return NextResponse.json(testData, { status: 201 });
        }

    } catch (error: any) {
        console.error('Placement test upsert error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
