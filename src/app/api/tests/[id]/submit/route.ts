import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as admin from 'firebase-admin';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId } = await params;
        const { answers } = await req.json();

        // Fetch test
        const testDoc = await adminDb.collection("Test").doc(testId).get();
        if (!testDoc.exists) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        const testData = testDoc.data() as any;

        // Fetch questions and options
        const questionsSnapshot = await adminDb.collection("Question")
            .where("testId", "==", testId)
            .get();

        let score = 0;
        const total = questionsSnapshot.docs.length;

        await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
            const userAnswer = answers[qDoc.id];

            const optionsSnapshot = await adminDb.collection("Option")
                .where("questionId", "==", qDoc.id)
                .where("isCorrect", "==", true)
                .limit(1)
                .get();

            const correctOption = optionsSnapshot.empty ? null : optionsSnapshot.docs[0].data();

            if (userAnswer && correctOption && userAnswer === correctOption.text) {
                score++;
            }
        }));

        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

        // Generate AI feedback
        let aiFeedback = null;
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

            const prompt = `You are an educational AI assistant. A student just completed a test titled "${testData.title}" with the following results:
- Score: ${score}/${total} (${percentage}%)
- Test Type: ${testData.type === 'company' ? `Company Test (${testData.company})` : `Aptitude Test (${testData.topic})`}
- Difficulty: ${testData.difficulty}

Provide constructive feedback in 2-3 paragraphs that:
1. Acknowledges their performance
2. Provides specific study recommendations
3. Encourages continued practice

Keep the tone supportive and motivating.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            aiFeedback = response.text();
        } catch (error) {
            console.error('AI feedback generation error:', error);
        }

        // Create result record
        const resultRef = adminDb.collection("Result").doc();
        const resultData = {
            id: resultRef.id,
            userId: session.user.id,
            testId: testId,
            score: score,
            total: total,
            aiFeedback: aiFeedback,
            createdAt: admin.firestore.Timestamp.now()
        };

        await resultRef.set(resultData);

        return NextResponse.json({
            message: 'Test submitted successfully',
            result: {
                id: resultRef.id,
                score: score,
                total: total,
                percentage: percentage,
                aiFeedback: aiFeedback,
            },
        });
    } catch (error: any) {
        console.error('Test submission error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
