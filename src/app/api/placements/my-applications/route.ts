import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const applicationsSnapshot = await adminDb.collection("PlacementApplication")
            .where("userId", "==", session.user.id)
            .orderBy("createdAt", "desc")
            .get();

        const applications = await Promise.all(applicationsSnapshot.docs.map(async (doc) => {
            const appId = doc.id;
            const appData = doc.data();

            const [eligibilitySnapshot, stagesSnapshot, voiceSnapshot] = await Promise.all([
                adminDb.collection("EligibilityCheck").where("applicationId", "==", appId).limit(1).get(),
                adminDb.collection("AssessmentStage").where("applicationId", "==", appId).orderBy("createdAt", "asc").get(),
                adminDb.collection("VoiceAssessment").where("applicationId", "==", appId).limit(1).get()
            ]);

            return {
                id: appId,
                ...appData,
                eligibilityCheck: eligibilitySnapshot.empty ? null : eligibilitySnapshot.docs[0].data(),
                assessmentStages: stagesSnapshot.docs.map(sDoc => sDoc.data()),
                voiceAssessment: voiceSnapshot.empty ? null : voiceSnapshot.docs[0].data(),
            };
        }));

        return NextResponse.json(applications);
    } catch (error: any) {
        console.error("Fetch applications error:", error);
        return NextResponse.json({ error: "Failed to fetch applications", details: error.message }, { status: 500 });
    }
}
