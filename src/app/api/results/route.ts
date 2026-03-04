import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const resultId = searchParams.get('id');

        if (resultId) {
            // Get specific result
            const resultDoc = await adminDb.collection("Result").doc(resultId).get();
            if (!resultDoc.exists) {
                return NextResponse.json({ error: 'Result not found' }, { status: 404 });
            }

            const result = { id: resultDoc.id, ...resultDoc.data() } as any;

            // Check if user owns this result or is admin
            if (result.userId !== session.user.id && (session.user as any).role !== 'admin') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            // Fetch Related Data
            const [testDoc, userDoc] = await Promise.all([
                adminDb.collection("Test").doc(result.testId).get(),
                adminDb.collection("User").doc(result.userId).get()
            ]);

            result.test = testDoc.exists ? { id: testDoc.id, ...testDoc.data() } : null;
            const userData = userDoc.data();
            result.user = userData ? { id: userDoc.id, name: userData.name, email: userData.email } : null;

            // Calculate percentage
            result.percentage = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

            return NextResponse.json({ result });
        } else {
            // Get all results for the user
            const resultsSnapshot = await adminDb.collection("Result")
                .where("userId", "==", session.user.id)
                .orderBy("createdAt", "desc")
                .get();

            const results = await Promise.all(resultsSnapshot.docs.map(async (doc) => {
                const data = doc.data() as any;
                const testDoc = await adminDb.collection("Test").doc(data.testId).get();

                return {
                    ...data,
                    id: doc.id,
                    test: testDoc.exists ? { id: testDoc.id, ...testDoc.data() } : null,
                    percentage: data.total > 0 ? Math.round((data.score / data.total) * 100) : 0
                };
            }));

            return NextResponse.json({ results });
        }
    } catch (error: any) {
        console.error('Results fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { testTitle, testType, company, score, total, duration } = body;

        // Try to find existing test
        const testSnapshot = await adminDb.collection("Test")
            .where("title", "==", testTitle)
            .where("type", "==", testType)
            .where("company", "==", company)
            .limit(1)
            .get();

        let testId;
        if (testSnapshot.empty) {
            // Create placeholder test
            const testRef = adminDb.collection("Test").doc();
            await testRef.set({
                title: testTitle,
                description: `${company} placement test`,
                duration: duration || 60,
                difficulty: 'Medium',
                type: testType,
                company: company || null,
                topic: company || testTitle,
                createdAt: admin.firestore.Timestamp.now()
            });
            testId = testRef.id;
        } else {
            testId = testSnapshot.docs[0].id;
        }

        // Create result
        const resultRef = adminDb.collection("Result").doc();
        const resultData = {
            id: resultRef.id,
            userId: session.user.id,
            testId,
            score,
            total,
            createdAt: admin.firestore.Timestamp.now()
        };

        await resultRef.set(resultData);

        return NextResponse.json({
            success: true,
            resultId: resultRef.id,
            score,
            total,
            percentage: Math.round((score / total) * 100),
        });
    } catch (error: any) {
        console.error('Result submission error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
