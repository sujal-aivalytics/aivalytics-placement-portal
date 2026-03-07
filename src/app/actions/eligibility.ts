"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';
import { UserProfile } from "@/types/placement";

export async function checkTestEligibility(testId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const userId = session.user.id;

        // Fetch User
        const userDoc = await adminDb.collection("User").doc(userId).get();
        if (!userDoc.exists) throw new Error("User not found");
        const userData = userDoc.data() as UserProfile;

        // Fetch Test
        const testDoc = await adminDb.collection("Test").doc(testId).get();
        if (!testDoc.exists) throw new Error("Test not found");
        const testData = testDoc.data() as any;

        const criteria = testData.eligibilityCriteria;
        if (!criteria) return { isEligible: true };

        // Simple validation logic (can be expanded)
        let isEligible = true;
        const reasons = [];

        if (criteria.minCGPA && (userData.graduationCGPA || 0) < criteria.minCGPA) {
            isEligible = false;
            reasons.push(`Minimum CGPA required: ${criteria.minCGPA}`);
        }

        if (criteria.minTenth && (userData.tenthPercentage || 0) < criteria.minTenth) {
            isEligible = false;
            reasons.push(`Minimum 10th percentage required: ${criteria.minTenth}`);
        }

        // Record eligibility check
        const eligibilityRef = adminDb.collection("TestEligibility").doc(`${userId}_${testId}`);
        await eligibilityRef.set({
            userId,
            testId,
            isEligible,
            reasons,
            checkedAt: admin.firestore.Timestamp.now()
        }, { merge: true });

        return { isEligible, reasons };
    } catch (error: any) {
        console.error("Eligibility check error:", error);
        return { isEligible: false, error: error.message };
    }
}

export async function saveEligibility(testId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const userId = session.user.id;

        // Implementation matches what eligibility-client expects
        // It's essentially a confirmation that the user checked their status and is proceeding
        const eligibilityRef = adminDb.collection("TestEligibility").doc(`${userId}_${testId}`);
        await eligibilityRef.set({
            userId,
            testId,
            isEligible: true, // If we're calling save, they've passed the client check
            checkedAt: admin.firestore.Timestamp.now()
        }, { merge: true });

        return { success: true };
    } catch (error: any) {
        console.error("Save eligibility error:", error);
        return { error: error.message };
    }
}
