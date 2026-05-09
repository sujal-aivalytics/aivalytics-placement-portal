import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
//import { adminDb } from '@/lib/firebase-config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as admin from 'firebase-admin';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { enrollmentId, roundId, answerText, difficulty } = body;

        if (!enrollmentId || !roundId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 1. Get/Create Round Progress
        const progressQuery = adminDb.collection("mockRoundProgress")
            .where("enrollmentId", "==", enrollmentId)
            .where("roundId", "==", roundId)
            .limit(1);

        let progressDoc: admin.firestore.QueryDocumentSnapshot | undefined = (await progressQuery.get()).docs[0];
        let progressData: any;

        if (!progressDoc) {
            const progressRef = adminDb.collection("mockRoundProgress").doc();
            progressData = {
                id: progressRef.id,
                enrollmentId,
                roundId,
                status: 'IN_PROGRESS',
                startedAt: admin.firestore.Timestamp.now(),
            };
            await progressRef.set(progressData);
            progressDoc = (await progressRef.get()) as admin.firestore.QueryDocumentSnapshot;
        } else {
            progressData = progressDoc.data();
        }

        // Fetch Round and Interactions
        const [roundDoc, interactionsSnapshot] = await Promise.all([
            adminDb.collection("mockRounds").doc(roundId).get(),
            adminDb.collection("mockInterviewInteraction")
                .where("roundProgressId", "==", progressDoc.id)
                .orderBy("orderIndex", "asc")
                .get()
        ]);

        const roundData = roundDoc.exists ? roundDoc.data() as any : {};
        const previousInteractions = interactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

        const roundMetadata = roundData.metadata || {};
        const topics = roundMetadata.topics;
        const companyContext = roundMetadata.companyContext;
        const isHR = roundData.type === 'HR_INTERVIEW';
        const maxQuestions = roundMetadata.maxQuestions || 20;

        const interviewType = isHR ? 'HR' : 'Technical';
        const companyName = companyContext ? companyContext : 'a company';
        const interviewContext = `${companyContext ? `Company Background: ${companyContext}. ` : ''}${!isHR && topics ? `Preferred Technical Topics: ${topics}.` : ''}`;

        const isFirstQuestion = previousInteractions.length === 0;
        let currentInteraction = previousInteractions[previousInteractions.length - 1];

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        // SCENARIO 1: START NEW INTERVIEW
        if (isFirstQuestion && !answerText) {
            const prompt = `You are a professional ${interviewType} interviewer at ${companyName}.
            The candidate is appearing for an interview with the following difficulty level: ${difficulty || 'Medium'}.
            
            Based on the initial interview context: "${interviewContext}",
            generate a first question that is appropriate for the ${difficulty || 'Medium'} difficulty level.
            If the difficulty is "Easy", start with basic introductory or fundamental questions.
            If the difficulty is "Expert", start with complex architectural or deep troubleshooting questions.
            
            Keep the tone professional and encouraging.
            Response MUST be only the question text.`;

            const result = await model.generateContent(prompt);
            const question = result.response.text();

            const interactionRef = adminDb.collection("mockInterviewInteraction").doc();
            await interactionRef.set({
                id: interactionRef.id,
                roundProgressId: progressDoc.id,
                questionText: question,
                orderIndex: 1,
                createdAt: admin.firestore.Timestamp.now()
            });

            return NextResponse.json({ question, feedback: null, isComplete: false });
        }

        // SCENARIO 2: ANSWERING A QUESTION
        if (currentInteraction && !currentInteraction.answerText && answerText) {
            // 1. Evaluate with Gemini
            const evaluationPrompt = `
                Question: ${currentInteraction.questionText}
                Candidate Answer: ${answerText}
                
                Evaluate this answer on a scale of 1-10. Provide brief feedback.
                Format: JSON { "score": number, "feedback": "string", "sentiment": "POSITIVE"|"NEUTRAL"|"NEGATIVE" }
            `;

            let evaluation = { score: 5, feedback: "Good attempt.", sentiment: "NEUTRAL" };
            try {
                const result = await model.generateContent(evaluationPrompt);
                const text = result.response.text();
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                evaluation = JSON.parse(jsonStr);
            } catch (e) {
                console.error("AI Eval failed", e);
            }

            // Update Interaction
            await adminDb.collection("mockInterviewInteraction").doc(currentInteraction.id).update({
                answerText,
                aiFeedback: evaluation.feedback,
                score: evaluation.score,
                sentiment: evaluation.sentiment,
                updatedAt: admin.firestore.Timestamp.now()
            });

            // Check if we should end
            if (previousInteractions.length >= maxQuestions) {
                // Final Evaluation Transaction
                const finalResult = await adminDb.runTransaction(async (transaction) => {
                    const allSnapshot = await adminDb.collection("mockInterviewInteraction")
                        .where("roundProgressId", "==", progressDoc.id)
                        .get();
                    const allInteractions = allSnapshot.docs.map(doc => doc.data());
                    const avgScore = allInteractions.reduce((acc, curr) => acc + (curr.score || 0), 0) / allInteractions.length;

                    let finalAiFeedback = {
                        scores: { programmingFundamentals: 5, oopConcepts: 5, dsaBasics: 5, collaboration: 5 },
                        feedback: "Interview completed.",
                        strengths: [],
                        weaknesses: [],
                        overallVerdict: "Maybe"
                    };

                    try {
                        const finalEvalPrompt = `
                            Evaluate the candidate's performance based on this interview:
                            Interactions: ${JSON.stringify(allInteractions.map(i => ({ q: i.questionText, a: i.answerText, s: i.score })))}
                            
                            Provide a brief summary and scores in JSON:
                            {
                                "scores": {
                                    "programmingFundamentals": number (1-10),
                                    "oopConcepts": number (1-10),
                                    "dsaBasics": number (1-10),
                                    "collaboration": number (1-10)
                                },
                                "feedback": "string",
                                "strengths": ["string"],
                                "weaknesses": ["string"],
                                "overallVerdict": "Hire" | "Maybe" | "Reject"
                            }
                        `;
                        const evalResult = await model.generateContent(finalEvalPrompt);
                        const evalText = evalResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                        finalAiFeedback = JSON.parse(evalText);
                    } catch (e) { }

                    transaction.update(adminDb.collection("mockRoundProgress").doc(progressDoc.id), {
                        status: 'COMPLETED',
                        completedAt: admin.firestore.Timestamp.now(),
                        score: avgScore * 10,
                        aiFeedback: JSON.stringify(finalAiFeedback)
                    });

                    return { feedback: evaluation.feedback, isComplete: true };
                });

                return NextResponse.json({ question: null, ...finalResult });
            }

            // Generate NEXT Question
            const nextQPrompt = `You are a professional ${interviewType} interviewer at ${companyName}.
            The interview difficulty level is set to ${difficulty || 'Medium'}.
            
            Current Interview State:
            - Context: ${interviewContext}
            - Latest Answer: "${answerText}"
            
            Response MUST be only the next follow-up question text.`;

            const result = await model.generateContent(nextQPrompt);
            const nextQ = result.response.text();

            const nextInteractionRef = adminDb.collection("mockInterviewInteraction").doc();
            await nextInteractionRef.set({
                id: nextInteractionRef.id,
                roundProgressId: progressDoc.id,
                questionText: nextQ,
                orderIndex: previousInteractions.length + 1,
                createdAt: admin.firestore.Timestamp.now()
            });

            return NextResponse.json({ question: nextQ, feedback: evaluation.feedback, isComplete: false });
        }

        // SCENARIO 3: RESUME
        if (currentInteraction && !currentInteraction.answerText && !answerText) {
            return NextResponse.json({ question: currentInteraction.questionText, feedback: null, isComplete: false });
        }

        return NextResponse.json({ error: 'Invalid State' }, { status: 400 });

    } catch (error: any) {
        console.error('Interview API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
