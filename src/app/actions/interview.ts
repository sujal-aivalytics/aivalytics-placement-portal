"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';
import { getAIInterviewResponse, InterviewContext } from "@/lib/interview-ai";

export async function generateQuestion(context: InterviewContext) {
    try {
        const response = await getAIInterviewResponse(context);
        return response;
    } catch (error: any) {
        console.error("Error in generateQuestion action:", error);
        return {
            question: "I'm sorry, I'm having trouble thinking of the next question. Could you tell me more about your experience?",
            error: error.message
        };
    }
}

export async function saveInterviewResult(roundId: string, enrollmentId: string, evaluation: any, transcript: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) throw new Error("Unauthorized");

        const userId = session.user.id;
        const now = admin.firestore.Timestamp.now();

        // Determine score (0-100) from evaluation scores (usually 1-10)
        const rawScore = evaluation.scores?.overallHireability ||
            evaluation.scores?.communication ||
            evaluation.scores?.technicalUnderstanding || 5;
        const score = Math.round(Number(rawScore) * 10);

        // Update MockRoundProgress
        const progressRef = adminDb.collection("MockRoundProgress").doc(`${userId}_${roundId}`);
        await progressRef.set({
            userId,
            enrollmentId,
            roundId,
            status: 'COMPLETED',
            score,
            feedback: evaluation.feedback || evaluation.detailedFeedback || "Interview completed successfully.",
            aiFeedback: JSON.stringify(evaluation),
            transcript,
            completedAt: now,
            updatedAt: now
        }, { merge: true });

        // Update enrollment if needed can be handled here or via separate action
        // For consistency with existing saveInterviewFeedback:
        const enrollmentSnapshot = await adminDb.collection("MockDriveEnrollment")
            .where("userId", "==", userId)
            .where("id", "==", enrollmentId)
            .limit(1)
            .get();

        if (!enrollmentSnapshot.empty) {
            const driveId = enrollmentSnapshot.docs[0].data().driveId;
            const roundsSnapshot = await adminDb.collection("MockRound")
                .where("driveId", "==", driveId)
                .orderBy("roundNumber", "desc")
                .limit(1)
                .get();

            if (!roundsSnapshot.empty && roundsSnapshot.docs[0].id === roundId) {
                await enrollmentSnapshot.docs[0].ref.update({
                    status: 'COMPLETED',
                    updatedAt: now
                });
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Interview result save error:", error);
        return { success: false, error: error.message };
    }
}

export async function saveInterviewFeedback(driveId: string, roundId: string, feedback: string, score: number) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) throw new Error("Unauthorized");

        const userId = session.user.id;
        const now = admin.firestore.Timestamp.now();

        // 1. Update MockRoundProgress
        const progressRef = adminDb.collection("MockRoundProgress").doc(`${userId}_${roundId}`);
        await progressRef.set({
            id: progressRef.id,
            userId,
            driveId,
            roundId,
            status: 'completed',
            score: Number(score),
            feedback,
            completedAt: now,
            updatedAt: now
        }, { merge: true });

        // 2. Check if this was the final round to update enrollment
        const roundsSnapshot = await adminDb.collection("MockRound")
            .where("driveId", "==", driveId)
            .orderBy("roundNumber", "desc")
            .limit(1)
            .get();

        if (!roundsSnapshot.empty && roundsSnapshot.docs[0].id === roundId) {
            // Final round completed - update enrollment
            const enrollmentSnapshot = await adminDb.collection("MockDriveEnrollment")
                .where("userId", "==", userId)
                .where("driveId", "==", driveId)
                .limit(1)
                .get();

            if (!enrollmentSnapshot.empty) {
                await enrollmentSnapshot.docs[0].ref.update({
                    status: 'completed',
                    updatedAt: now
                });
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Interview save error:", error);
        return { success: false, error: error.message };
    }
}

export async function getInterviewProgress(driveId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) throw new Error("Unauthorized");

        const snapshot = await adminDb.collection("MockRoundProgress")
            .where("userId", "==", session.user.id)
            .where("driveId", "==", driveId)
            .get();

        return {
            success: true,
            progress: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
