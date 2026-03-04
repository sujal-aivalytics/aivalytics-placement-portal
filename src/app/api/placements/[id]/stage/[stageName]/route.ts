import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; stageName: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, stageName } = await params;
        const body = await request.json();
        const { answers, score, total, timeSpent, essayText, code, language, proctoringData } = body;

        // Fetch application
        const applicationDoc = await adminDb.collection("PlacementApplication").doc(id).get();
        if (!applicationDoc.exists) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const application = applicationDoc.data() as any;

        // Verify application belongs to user or user is admin
        const userSnapshot = await adminDb.collection("User").where("email", "==", session.user.email).limit(1).get();
        const currentUser = userSnapshot.docs[0].data();

        if (application.userId !== userSnapshot.docs[0].id && (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if stage already completed
        const stagesSnapshot = await adminDb.collection("AssessmentStage")
            .where("applicationId", "==", id)
            .where("stageName", "==", stageName)
            .limit(1)
            .get();

        const existingStage = stagesSnapshot.empty ? null : { ...stagesSnapshot.docs[0].data(), id: stagesSnapshot.docs[0].id } as any;

        if (existingStage && existingStage.submittedAt) {
            return NextResponse.json({ error: 'Stage already completed' }, { status: 400 });
        }

        // Calculate score on backend
        let calculatedScore = score;
        let calculatedTotal = total;

        const stageTopicMap: Record<string, string> = {
            'foundation': 'Foundation',
            'advanced': 'Advanced',
            'aptitude': 'Aptitude',
        };

        const topic = stageTopicMap[stageName];
        if (topic) {
            const testsSnapshot = await adminDb.collection("Test")
                .where("type", "==", "company")
                .where("company", "==", application.company)
                .where("topic", "==", topic)
                .limit(1)
                .get();

            if (!testsSnapshot.empty) {
                const testId = testsSnapshot.docs[0].id;
                const questionsSnapshot = await adminDb.collection("Question")
                    .where("testId", "==", testId)
                    .get();

                calculatedTotal = questionsSnapshot.docs.length;
                calculatedScore = 0;

                await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
                    const qData = qDoc.data();
                    const userAnswerText = (answers as any)[qDoc.id];

                    const optionsSnapshot = await adminDb.collection("Option")
                        .where("questionId", "==", qDoc.id)
                        .where("isCorrect", "==", true)
                        .limit(1)
                        .get();

                    const correctOption = optionsSnapshot.empty ? null : optionsSnapshot.docs[0].data();

                    if (userAnswerText && correctOption && userAnswerText === correctOption.text) {
                        calculatedScore++;
                    }
                }));
            }
        }

        const percentage = calculatedTotal > 0 ? (calculatedScore / calculatedTotal) * 100 : 0;
        const isPassed = calculatePassStatus(application.company, stageName, percentage, calculatedScore);

        const batch = adminDb.batch();

        // Create or update assessment stage
        let stageRef;
        if (existingStage) {
            stageRef = adminDb.collection("AssessmentStage").doc(existingStage.id);
            batch.update(stageRef, {
                score: calculatedScore,
                total: calculatedTotal,
                percentage,
                isPassed,
                timeSpent,
                submittedAt: admin.firestore.Timestamp.now()
            });
        } else {
            stageRef = adminDb.collection("AssessmentStage").doc();
            batch.set(stageRef, {
                id: stageRef.id,
                applicationId: id,
                stageName,
                score: calculatedScore,
                total: calculatedTotal,
                percentage,
                isPassed,
                timeSpent,
                submittedAt: admin.firestore.Timestamp.now(),
                createdAt: admin.firestore.Timestamp.now()
            });
        }

        // Log violations
        if (proctoringData?.violations?.length > 0) {
            proctoringData.violations.forEach((v: any) => {
                const eventRef = adminDb.collection("MonitoringEvent").doc();
                batch.set(eventRef, {
                    id: eventRef.id,
                    userId: application.userId,
                    eventType: `violation_${v.type}`,
                    violationType: v.type,
                    details: JSON.stringify(v.metadata || {}),
                    timestamp: admin.firestore.Timestamp.fromDate(new Date(v.timestamp)),
                    testType: `placement_${stageName}`
                });
            });
        }

        // Update application status
        const nextStage = determineNextStage(application.company, stageName, isPassed);
        const newStatus = isPassed ? nextStage : 'rejected';

        batch.update(adminDb.collection("PlacementApplication").doc(id), {
            status: newStatus,
            currentStage: isPassed ? nextStage : stageName,
            finalDecision: isPassed ? admin.firestore.FieldValue.delete() : 'rejected',
            updatedAt: admin.firestore.Timestamp.now()
        });

        // Check if all stages completed
        if (isPassed && isLastStage(application.company, nextStage)) {
            // Re-fetch all stages for track assignment
            const allStagesSnapshot = await adminDb.collection("AssessmentStage")
                .where("applicationId", "==", id)
                .get();
            const allStagesData = allStagesSnapshot.docs.map(doc => doc.data() as any);

            // Add current stage if not in snapshot yet
            if (!allStagesData.find(s => s.stageName === stageName)) {
                allStagesData.push({ stageName, percentage });
            }

            const track = await assignTrack(application.company, allStagesData);
            batch.update(adminDb.collection("PlacementApplication").doc(id), {
                finalTrack: track,
                finalDecision: 'selected',
                status: 'completed'
            });

            await batch.commit();
            return NextResponse.json({
                success: true,
                isPassed,
                nextStage: 'completed',
                track,
                message: `Congratulations! You have been selected for ${track} track.`
            });
        }

        await batch.commit();

        return NextResponse.json({
            success: true,
            isPassed,
            nextStage: isPassed ? nextStage : null,
            percentage,
            score: calculatedScore,
            total: calculatedTotal
        });
    } catch (error: any) {
        console.error('Error submitting stage:', error);
        return NextResponse.json({ error: 'Failed to submit stage assessment', details: error.message }, { status: 500 });
    }
}

function calculatePassStatus(company: string, stageName: string, percentage: number, score: number): boolean {
    if (company === 'TCS') {
        if (stageName === 'foundation') return percentage >= 60;
        if (stageName === 'advanced') return percentage >= 65;
        if (stageName === 'coding') return score >= 2;
    } else if (company === 'Wipro') {
        if (stageName === 'aptitude') return percentage >= 65;
        if (stageName === 'essay') return percentage >= 70;
        if (stageName === 'coding') return score >= 1;
    }
    return false;
}

function determineNextStage(company: string, currentStage: string, isPassed: boolean): string {
    if (!isPassed) return currentStage;
    if (company === 'TCS') {
        const stages = ['foundation', 'advanced', 'coding', 'interview', 'completed'];
        const currentIndex = stages.indexOf(currentStage);
        return stages[currentIndex + 1] || 'completed';
    } else if (company === 'Wipro') {
        const stages = ['aptitude', 'essay', 'coding', 'voice', 'interview', 'completed'];
        const currentIndex = stages.indexOf(currentStage);
        return stages[currentIndex + 1] || 'completed';
    }
    return 'completed';
}

function isLastStage(company: string, stage: string): boolean {
    return stage === 'interview' || stage === 'completed';
}

async function assignTrack(company: string, stages: any[]): Promise<string> {
    if (company === 'TCS') {
        const codingStage = stages.find((s: any) => s.stageName === 'coding');
        if (codingStage) {
            const codingPercentage = codingStage.percentage || 0;
            if (codingPercentage >= 83) return 'Digital';
            if (codingPercentage >= 67) return 'Ninja';
        }
        return 'Ninja';
    } else if (company === 'Wipro') {
        const totalPercentage = stages.reduce((sum: number, s: any) => sum + (s.percentage || 0), 0);
        const avgPercentage = totalPercentage / (stages.length || 1);
        if (avgPercentage >= 80) return 'Turbo';
        if (avgPercentage >= 70) return 'Elite';
        return 'Elite';
    }
    return 'Standard';
}
