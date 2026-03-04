"use server"

import { adminDb } from "@/lib/firebase-config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as admin from 'firebase-admin';

export async function logMonitoringEvent(
    arg1: string | { type: string; details: string; level?: string },
    type?: string,
    details?: string
) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || "anonymous";
        const now = admin.firestore.Timestamp.now();

        let eventData: any;
        if (typeof arg1 === 'string') {
            // Positional: (testId/company, type, details)
            eventData = {
                testId: arg1,
                violationType: type, // Some calls use violationType/type interchangeably in UI
                details: details,
                type: type, // Keep both for safety
            };
        } else {
            // Object: ({ type, details, level })
            eventData = { ...arg1 };
        }

        const eventRef = adminDb.collection("MonitoringEvent").doc();
        await eventRef.set({
            id: eventRef.id,
            userId,
            ...eventData,
            level: eventData.level || "info",
            timestamp: now,
            createdAt: now
        });

        return { success: true };
    } catch (error) {
        console.error("Monitoring log error:", error);
        return { success: false };
    }
}

/** Fetches monitoring events for the currently logged-in user */
export async function getMonitoringEvents() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return [];

        const snapshot = await adminDb.collection("MonitoringEvent")
            .where("userId", "==", session.user.id)
            .orderBy("timestamp", "desc")
            .limit(50)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
        }));
    } catch (error) {
        console.error("Fetch profile monitoring error:", error);
        return [];
    }
}

export async function getRecentMonitoringEvents(limit = 50) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'admin') throw new Error("Unauthorized");

        const snapshot = await adminDb.collection("MonitoringEvent")
            .orderBy("timestamp", "desc")
            .limit(limit)
            .get();

        const events = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            // Unified "users" collection check
            const userDoc = data.userId !== "anonymous" ? await adminDb.collection("users").doc(data.userId).get() : null;
            const userData = userDoc?.data();

            return {
                id: doc.id,
                ...data,
                user: userData ? { name: userData.name, email: userData.email } : { name: "Anonymous" },
                timestamp: data.timestamp?.toDate?.() || data.timestamp
            };
        }));

        return events;
    } catch (error) {
        console.error("Fetch monitoring error:", error);
        return [];
    }
}
