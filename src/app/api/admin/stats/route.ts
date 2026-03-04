import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all results to calculate stats
        const resultsSnapshot = await adminDb.collection("Result").get();
        const totalSubmissions = resultsSnapshot.size;

        if (totalSubmissions === 0) {
            return NextResponse.json({
                totalSubmissions: 0,
                averagePercentage: 0,
                highScore: 0,
                recentSubmissions: []
            });
        }

        let totalPercentage = 0;
        let highScore = 0;
        resultsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            totalPercentage += data.percentage || 0;
            if ((data.percentage || 0) > highScore) highScore = data.percentage;
        });

        const averagePercentage = totalPercentage / totalSubmissions;

        // Fetch Recent Submissions
        const recentSnapshot = await adminDb.collection("Result")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();

        const recentSubmissions = await Promise.all(recentSnapshot.docs.map(async (doc) => {
            const rData = doc.data();

            // Join User
            const userDoc = await adminDb.collection("User").doc(rData.userId).get();
            const userData = userDoc.data();

            // Join Test
            const testDoc = await adminDb.collection("Test").doc(rData.testId).get();
            const testData = testDoc.data();

            return {
                id: doc.id,
                ...rData,
                user: { name: userData?.name || 'Unknown' },
                test: { title: testData?.title || 'Unknown' }
            };
        }));

        return NextResponse.json({
            totalSubmissions,
            averagePercentage,
            highScore,
            recentSubmissions
        });
    } catch (error: any) {
        console.error('Admin stats global error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
