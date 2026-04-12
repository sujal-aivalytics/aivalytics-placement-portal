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
            .get();

        const applications = await Promise.all(
            applicationsSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() as any }))
                .sort((a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA;
                })
                .map(async (appData) => {
                    const appId = appData.id;

                    const [eligibilitySnapshot, stagesSnapshot, voiceSnapshot] = await Promise.all([
                        adminDb.collection("EligibilityCheck").where("applicationId", "==", appId).limit(1).get(),
                        adminDb.collection("AssessmentStage").where("applicationId", "==", appId).get(),
                        adminDb.collection("VoiceAssessment").where("applicationId", "==", appId).limit(1).get()
                    ]);

                    const assessmentStages = stagesSnapshot.docs
                        .map(sDoc => sDoc.data())
                        .sort((a: any, b: any) => {
                            const dateA = a.createdAt?.seconds || 0;
                            const dateB = b.createdAt?.seconds || 0;
                            return dateA - dateB;
                        });

                    return {
                        ...appData,
                        eligibilityCheck: eligibilitySnapshot.empty ? null : eligibilitySnapshot.docs[0].data(),
                        assessmentStages,
                        voiceAssessment: voiceSnapshot.empty ? null : voiceSnapshot.docs[0].data(),
                    };
                })
        );

        return NextResponse.json(applications);
    } catch (error: any) {
        console.error("Fetch applications error:", error);
        return NextResponse.json({ error: "Failed to fetch applications", details: error.message }, { status: 500 });
    }
}
