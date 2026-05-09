import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
//import { adminDb } from '@/lib/firebase-config';
import { executeCode } from '@/lib/judge0';
import { LANGUAGES } from '@/config/languages';
import { generateCodingEvaluation } from '@/lib/assessment-ai';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { enrollmentId, roundId, questionId, code, language } = body;

        const judge0Id = (LANGUAGES as any)[language]?.judge0_id;
        if (!judge0Id) return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });

        // 1. Fetch Question & Test Cases
        const questionDoc = await adminDb.collection("mockQuestions").doc(questionId).get();
        if (!questionDoc.exists) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }
        const question = questionDoc.data() as any;

        const metadata = question.codingMetadata ? (typeof question.codingMetadata === 'string' ? JSON.parse(question.codingMetadata) : question.codingMetadata) : {};
        const testCases = metadata.testCases || [];

        // 2. Prepare Code for Execution
        const drivers = metadata.driverCode || {};
        let fullcode = drivers[language] || code;

        if (drivers[language]) {
            fullcode = fullcode.replace("{{USER_CODE}}", code);
        }

        // 3. Execute with Judge0
        let runResults: any[] = [];
        if (testCases.length === 0) {
            const result = await executeCode(fullcode, judge0Id, "");
            runResults.push(result);
        } else {
            runResults = await Promise.all(
                testCases.map((tc: any) =>
                    executeCode(fullcode, judge0Id, tc.input?.toString().trim() || "")
                )
            );
        }

        const passedCases = runResults.filter((res: any, index: number) => {
            const stdout = (res.stdout || "").trim();
            const expected = testCases[index]?.output?.toString().trim() || "";
            return res.status.id === 3 && (testCases.length === 0 || stdout === expected);
        }).length;

        const totalCases = Math.max(testCases.length, 1);
        const score = (passedCases / totalCases) * 100;
        const isPassed = score >= 60;

        // Generate AI Evaluation
        const aiEvaluation = await generateCodingEvaluation(
            score,
            code,
            language,
            passedCases,
            totalCases,
            question.text,
            question.text
        );

        // 4. Atomic Updates in Transaction
        await adminDb.runTransaction(async (transaction: admin.firestore.Transaction) => {
            // A. READS FIRST
            const progressQuery = adminDb.collection("mockRoundProgress")
                .where("enrollmentId", "==", enrollmentId)
                .where("roundId", "==", roundId)
                .limit(1);

            const progressSnapshot = await transaction.get(progressQuery);

            let progressId: string;
            let progressRef: admin.firestore.DocumentReference;
            let progressExists = !progressSnapshot.empty;

            if (!progressExists) {
                progressRef = adminDb.collection("mockRoundProgress").doc();
                progressId = progressRef.id;
            } else {
                progressRef = progressSnapshot.docs[0].ref;
                progressId = progressSnapshot.docs[0].id;
            }

            const responseQuery = adminDb.collection("mockResponse")
                .where("roundProgressId", "==", progressId)
                .where("questionId", "==", questionId)
                .limit(1);

            const responseSnapshot = await transaction.get(responseQuery);

            const enrollmentRef = adminDb.collection("mockDriveEnrollment").doc(enrollmentId);
            const enrollmentDoc = await transaction.get(enrollmentRef);

            // B. ADDITIONAL DATA (Rounds check)
            let isLastRound = false;
            let currentRound = 1;
            let overallScore = 0;

            if (enrollmentDoc.exists) {
                const enrollment = enrollmentDoc.data() as any;
                const roundsSnapshot = await adminDb.collection("mockRounds").where("driveId", "==", enrollment.driveId).get();
                const totalRounds = roundsSnapshot.size;
                currentRound = enrollment.currentRoundNumber || 1;
                isLastRound = currentRound >= totalRounds;
                overallScore = enrollment.overallScore || 0;
            }

            // C. WRITES SECOND
            const progressUpdate = {
                status: 'COMPLETED',
                completedAt: admin.firestore.Timestamp.now(),
                score: score,
                totalQuestions: 1,
                answeredQuestions: 1,
                aiFeedback: JSON.stringify(aiEvaluation)
            };

            if (!progressExists) {
                transaction.set(progressRef!, {
                    ...progressUpdate,
                    id: progressId,
                    enrollmentId,
                    roundId,
                    startedAt: admin.firestore.Timestamp.now(),
                });
            } else {
                transaction.update(progressRef!, progressUpdate);
            }

            const responseData = {
                roundProgressId: progressId,
                questionId,
                answer: code,
                language,
                isCorrect: passedCases === totalCases,
                score,
                passedCases,
                totalCases,
                lastSavedAt: admin.firestore.Timestamp.now()
            };

            if (responseSnapshot.empty) {
                const resRef = adminDb.collection("mockResponse").doc();
                transaction.set(resRef, { ...responseData, id: resRef.id });
            } else {
                transaction.update(responseSnapshot.docs[0].ref, responseData);
            }

            if (enrollmentDoc.exists) {
                if (isPassed) {
                    const updatedOverallScore = ((overallScore * (currentRound - 1)) + score) / currentRound;
                    transaction.update(enrollmentRef, {
                        currentRoundNumber: isLastRound ? currentRound : currentRound + 1,
                        overallScore: updatedOverallScore,
                        status: isLastRound ? 'PASSED' : 'IN_PROGRESS',
                        updatedAt: admin.firestore.Timestamp.now()
                    });
                } else {
                    transaction.update(enrollmentRef, {
                        status: 'FAILED',
                        updatedAt: admin.firestore.Timestamp.now()
                    });
                }
            }
        });

        // 5. Format results for UI
        const formattedRunResults = runResults.map((res: any, index: number) => {
            const stdout = (res.stdout || "").trim();
            const expected = testCases[index]?.output?.toString().trim() || "";
            const passed = res.status.id === 3 && (testCases.length === 0 || stdout === expected);

            return {
                status: passed ? { id: 3, description: "Accepted" } : (res.status.id === 3 ? { id: 4, description: "Wrong Answer" } : res.status),
                stdout,
                stderr: res.stderr,
                compile_output: res.compile_output || ""
            };
        });

        return NextResponse.json({
            success: true,
            score,
            passedCases,
            totalCases,
            isPassed,
            results: formattedRunResults
        });

    } catch (error: any) {
        console.error('Coding Submit Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
