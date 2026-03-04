"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';

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
