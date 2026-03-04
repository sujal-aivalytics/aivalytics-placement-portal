import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Top Performers (Top 10 by average score across results)
        const resultsSnapshot = await adminDb.collection("Result").get();
        const userScores: Record<string, { total: number, count: number }> = {};

        resultsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (!userScores[data.userId]) {
                userScores[data.userId] = { total: 0, count: 0 };
            }
            userScores[data.userId].total += data.percentage || 0;
            userScores[data.userId].count += 1;
        });

        const topPerformersData = await Promise.all(
            Object.entries(userScores)
                .map(([userId, stats]) => ({ userId, avg: stats.total / stats.count }))
                .sort((a, b) => b.avg - a.avg)
                .slice(0, 10)
                .map(async (item) => {
                    const userDoc = await adminDb.collection("User").doc(item.userId).get();
                    const userData = userDoc.data();
                    return {
                        id: item.userId,
                        name: userData?.name || 'Unknown',
                        averageScore: item.avg,
                        testCount: userScores[item.userId].count
                    };
                })
        );

        // 2. Test Success Rate (Topic-wise)
        const testsSnapshot = await adminDb.collection("Test").get();
        const topicAnalytics: Record<string, { totalScore: number, submissions: number }> = {};

        resultsSnapshot.docs.forEach(doc => {
            const rData = doc.data();
            // We need to know the test's topic/category. 
            // In a real scenario, we might have it in the result or fetch the test.
            // For now, let's assume we fetch all tests once and use a map.
        });

        const testsMap = new Map();
        testsSnapshot.docs.forEach(doc => testsMap.set(doc.id, doc.data()));

        resultsSnapshot.docs.forEach(doc => {
            const rData = doc.data();
            const test = testsMap.get(rData.testId);
            const topic = test?.category || 'General';
            if (!topicAnalytics[topic]) {
                topicAnalytics[topic] = { totalScore: 0, submissions: 0 };
            }
            topicAnalytics[topic].totalScore += rData.percentage || 0;
            topicAnalytics[topic].submissions += 1;
        });

        const performanceByTopic = Object.entries(topicAnalytics).map(([topic, stats]) => ({
            topic,
            averageScore: stats.totalScore / stats.submissions,
            submissions: stats.submissions
        }));

        return NextResponse.json({
            topPerformers: topPerformersData,
            performanceByTopic
        });
    } catch (error: any) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
