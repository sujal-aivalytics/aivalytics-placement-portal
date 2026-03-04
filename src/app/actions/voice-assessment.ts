"use server"

import { adminDb } from "@/lib/firebase-config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as admin from 'firebase-admin';

export async function submitVoiceAssessment(data: {
    applicationId: string;
    score: number;
    feedback: string;
    transcription?: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const now = admin.firestore.Timestamp.now();

        // 1. Verify application
        const appDoc = await adminDb.collection("PlacementApplication").doc(data.applicationId).get();
        if (!appDoc.exists) throw new Error("Application not found");

        // 2. Upsert Voice Assessment
        const assessmentRef = adminDb.collection("VoiceAssessment").doc(data.applicationId);
        await assessmentRef.set({
            id: assessmentRef.id,
            userId: session.user.id,
            ...data,
            createdAt: now,
            updatedAt: now
        }, { merge: true });

        // 3. Update application stage
        await adminDb.collection("PlacementApplication").doc(data.applicationId).update({
            currentStage: 'interview', // Move to interview after voice
            updatedAt: now
        });

        return { success: true };
    } catch (error: any) {
        console.error("Voice assessment save error:", error);
        return { success: false, error: error.message };
    }
}

export async function getVoiceAssessment(applicationId: string) {
    try {
        const doc = await adminDb.collection("VoiceAssessment").doc(applicationId).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
        return null;
    }
}
