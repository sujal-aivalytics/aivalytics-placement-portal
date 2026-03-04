"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';

export async function getActiveMockSession(driveId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const snapshot = await adminDb.collection("MockDriveSession")
            .where("userId", "==", session.user.id)
            .where("driveId", "==", driveId)
            .where("status", "==", "active")
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
        return null;
    }
}

export async function startMockSession(driveId: string, roundId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const now = admin.firestore.Timestamp.now();
        const sessionRef = adminDb.collection("MockDriveSession").doc();

        const sessionData = {
            id: sessionRef.id,
            userId: session.user.id,
            driveId,
            roundId,
            status: 'active',
            startTime: now,
            createdAt: now,
            updatedAt: now
        };

        await sessionRef.set(sessionData);

        return { success: true, sessionId: sessionRef.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function completeMockSession(sessionId: string) {
    try {
        await adminDb.collection("MockDriveSession").doc(sessionId).update({
            status: 'completed',
            endTime: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function abandonMockSession(sessionId: string) {
    try {
        await adminDb.collection("MockDriveSession").doc(sessionId).update({
            status: 'abandoned',
            updatedAt: admin.firestore.Timestamp.now()
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
