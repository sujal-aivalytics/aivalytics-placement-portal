"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';
import { UserProfile, PlacementApplication } from "@/types/placement";

export async function getOrCreatePlacementApplication(company: string): Promise<{ application: PlacementApplication, user: UserProfile | null }> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const userId = session.user.id;
        const userDoc = await adminDb.collection("User").doc(userId).get();
        const user = userDoc.exists ? { id: userDoc.id, ...userDoc.data() } as UserProfile : null;

        // Check for existing application
        const existingSnapshot = await adminDb.collection("PlacementApplication")
            .where("userId", "==", userId)
            .where("company", "==", company)
            .limit(1)
            .get();

        if (!existingSnapshot.empty) {
            return { application: existingSnapshot.docs[0].data() as PlacementApplication, user };
        }

        // Create new application
        const appRef = adminDb.collection("PlacementApplication").doc();
        const appData: PlacementApplication = {
            id: appRef.id,
            userId,
            company,
            status: "eligibility_check",
            currentStage: "eligibility",
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        };

        await appRef.set(appData);

        return { application: appData, user };
    } catch (error: any) {
        console.error("getOrCreatePlacementApplication error:", error);
        throw error;
    }
}

export async function checkEligibility(company: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const userId = session.user.id;
        const userDoc = await adminDb.collection("User").doc(userId).get();

        if (!userDoc.exists) {
            return { isEligible: false, reasons: ["User profile not found"] };
        }

        const data = userDoc.data() as UserProfile;
        const reasons: string[] = [];

        // Basic criteria
        const tenth = data.tenthPercentage || 0;
        const twelfth = data.twelfthPercentage || 0;
        const cgpa = data.graduationCGPA || 0;
        const backlogs = data.backlogs || 0;
        const gapYears = data.gapYears || 0;

        if (tenth < 60) reasons.push("10th percentage is below 60%");
        if (twelfth < 60) reasons.push("12th percentage is below 60%");
        if (cgpa < 6.0) reasons.push("Graduation CGPA is below 6.0");
        if (backlogs > 0) reasons.push("Active backlogs are not allowed");

        if (company === "TCS") {
            if (gapYears > 2) reasons.push("Gap in education exceeds 24 months");
        } else if (company === "Wipro") {
            if (gapYears > 3) reasons.push("Gap before graduation exceeds 3 years");
        }

        return {
            isEligible: reasons.length === 0,
            reasons,
        };
    } catch (error: any) {
        console.error("checkEligibility error:", error);
        return { isEligible: false, error: error.message };
    }
}


export async function applyForPlacement(placementId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const userId = session.user.id;
        const now = admin.firestore.Timestamp.now();

        // Check for existing application
        const existingSnapshot = await adminDb.collection("PlacementApplication")
            .where("userId", "==", userId)
            .where("placementId", "==", placementId)
            .limit(1)
            .get();

        if (!existingSnapshot.empty) {
            return { success: true, application: existingSnapshot.docs[0].data() };
        }

        // Create new application
        const appRef = adminDb.collection("PlacementApplication").doc();
        const appData = {
            id: appRef.id,
            userId,
            placementId,
            status: 'applied',
            currentStage: 'foundation',
            createdAt: now,
            updatedAt: now
        };

        await appRef.set(appData);

        return { success: true, application: appData };
    } catch (error: any) {
        console.error("Apply error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateApplicationStatus(applicationId: string, status: string, nextStage?: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const updateData: any = {
            status,
            updatedAt: admin.firestore.Timestamp.now()
        };
        if (nextStage) updateData.currentStage = nextStage;

        await adminDb.collection("PlacementApplication").doc(applicationId).update(updateData);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getUserProfile() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const userDoc = await adminDb.collection("User").doc(session.user.id).get();
        return { success: true, user: userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateProfile(data: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        await adminDb.collection("User").doc(session.user.id).update({
            ...data,
            updatedAt: admin.firestore.Timestamp.now()
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
