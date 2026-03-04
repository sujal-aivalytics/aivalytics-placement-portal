import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { company } = await request.json();

        if (!company || !["TCS", "Wipro"].includes(company)) {
            return NextResponse.json({ error: "Invalid company" }, { status: 400 });
        }

        // Check if user already has an active application for this company
        const activeApplicationsSnapshot = await adminDb.collection("PlacementApplication")
            .where("userId", "==", session.user.id)
            .where("company", "==", company)
            .get();

        const activeApplications = activeApplicationsSnapshot.docs.map(doc => doc.data());
        const hasActive = activeApplications.some(app =>
            !["rejected", "withdrawn", "completed"].includes(app.status)
        );

        if (hasActive) {
            return NextResponse.json(
                { error: "You already have an active application for this company" },
                { status: 400 }
            );
        }

        // Create new application
        const applicationRef = adminDb.collection("PlacementApplication").doc();
        const applicationData = {
            id: applicationRef.id,
            userId: session.user.id,
            company,
            status: "eligibility_check",
            currentStage: "eligibility",
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        };

        await applicationRef.set(applicationData);

        return NextResponse.json(applicationData);
    } catch (error: any) {
        console.error("Error creating application:", error);
        return NextResponse.json(
            { error: "Failed to create application", details: error.message },
            { status: 500 }
        );
    }
}
