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
                .map(([userId, stats]) => ({ userId, avg: stats.count > 0 ? stats.total / stats.count : 0 }))
                .sort((a, b) => b.avg - a.avg)
                .slice(0, 5) // Top 5 as per UI design
                .map(async (item) => {
                    const userDoc = await adminDb.collection("users").doc(item.userId).get();
                    const userData = userDoc.data();
                    return {
                        id: item.userId,
                        name: userData?.name || 'Unknown',
                        avgScore: Math.round(item.avg),
                        tests: userScores[item.userId].count
                    };
                })
        );

        // 2. Performance Analysis (Topic & Company)
        const testsSnapshot = await adminDb.collection("Test").get();
        const testsMap = new Map();
        testsSnapshot.docs.forEach(doc => testsMap.set(doc.id, doc.data()));

        const topicAnalytics: Record<string, { totalScore: number, submissions: number }> = {};
        const companyAnalytics: Record<string, { totalScore: number, submissions: number }> = {};

        resultsSnapshot.docs.forEach(doc => {
            const rData = doc.data();
            const test = testsMap.get(rData.testId);
            
            // Topic Analysis
            const topic = test?.topic || test?.category || 'General';
            if (!topicAnalytics[topic]) {
                topicAnalytics[topic] = { totalScore: 0, submissions: 0 };
            }
            topicAnalytics[topic].totalScore += rData.percentage || 0;
            topicAnalytics[topic].submissions += 1;

            // Company Analysis
            if (test?.type === 'company' && test?.company) {
                const company = test.company;
                if (!companyAnalytics[company]) {
                    companyAnalytics[company] = { totalScore: 0, submissions: 0 };
                }
                companyAnalytics[company].totalScore += rData.percentage || 0;
                companyAnalytics[company].submissions += 1;
            }
        });

        const topicPerformance = Object.entries(topicAnalytics).map(([topic, stats]) => ({
            topic,
            avgScore: stats.submissions > 0 ? Math.round(stats.totalScore / stats.submissions) : 0,
            attempts: stats.submissions,
            difficulty: 'Medium' // Default or aggregate from test.difficulty
        }));

        const companyPerformance = Object.entries(companyAnalytics).map(([company, stats]) => ({
            company,
            avgScore: stats.submissions > 0 ? Math.round(stats.totalScore / stats.submissions) : 0,
            attempts: stats.submissions,
            difficulty: 'Medium'
        }));

        return NextResponse.json({
            topPerformers: topPerformersData,
            topicPerformance,
            companyPerformance
        });
    } catch (error: any) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
