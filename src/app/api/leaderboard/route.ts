import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const testId = searchParams.get('testId');
        const limit = parseInt(searchParams.get('limit') || '10');

        let query = adminDb.collection("Result").orderBy("score", "desc").limit(limit);

        if (testId) {
            query = adminDb.collection("Result")
                .where("testId", "==", testId)
                .orderBy("score", "desc")
                .limit(limit);
        }

        const resultsSnapshot = await query.get();

        const leaderboard = await Promise.all(resultsSnapshot.docs.map(async (rDoc) => {
            const rData = rDoc.data() as any;

            // Fetch User detail
            const userDoc = await adminDb.collection("User").doc(rData.userId).get();
            const userData = userDoc.data() as any;

            // Fetch Test detail
            const testDoc = await adminDb.collection("Test").doc(rData.testId).get();
            const testData = testDoc.data() as any;

            return {
                id: rDoc.id,
                score: rData.score,
                percentage: rData.percentage,
                createdAt: rData.createdAt,
                user: {
                    name: userData?.name || 'Anonymous',
                    image: userData?.image,
                    college: userData?.college
                },
                test: {
                    title: testData?.title || 'Deleted Test'
                }
            };
        }));

        // Get personal rank if logged in
        const session = await getServerSession(authOptions);
        let personalStats = null;

        if (session?.user && testId) {
            const userResultsSnapshot = await adminDb.collection("Result")
                .where("testId", "==", testId)
                .where("userId", "==", session.user.id)
                .orderBy("score", "desc")
                .limit(1)
                .get();

            if (!userResultsSnapshot.empty) {
                const bestResult = userResultsSnapshot.docs[0].data();

                // Count how many people have higher scores
                const higherScoresSnapshot = await adminDb.collection("Result")
                    .where("testId", "==", testId)
                    .where("score", ">", bestResult.score)
                    .get();

                personalStats = {
                    rank: higherScoresSnapshot.size + 1,
                    bestScore: bestResult.score,
                    percentage: bestResult.percentage
                };
            }
        }

        return NextResponse.json({
            leaderboard,
            personalStats
        });
    } catch (error: any) {
        console.error('Leaderboard fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
