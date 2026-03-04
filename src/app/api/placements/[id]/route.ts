import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Fetch application document
        const applicationDoc = await adminDb.collection("PlacementApplication").doc(id).get();

        if (!applicationDoc.exists) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const application = { id: applicationDoc.id, ...applicationDoc.data() } as any;

        // Ensure user can only access their own application
        if (application.userId !== session.user.id && (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch Related Data Parallely
        const [userDoc, eligibilitySnapshot, stagesSnapshot, voiceSnapshot] = await Promise.all([
            adminDb.collection("User").doc(application.userId).get(),
            adminDb.collection("EligibilityCheck").where("applicationId", "==", id).limit(1).get(),
            adminDb.collection("AssessmentStage").where("applicationId", "==", id).orderBy("createdAt", "asc").get(),
            adminDb.collection("VoiceAssessment").where("applicationId", "==", id).limit(1).get()
        ]);

        // Build the combined object
        const userData = userDoc.data();
        if (userData) {
            application.user = {
                id: userDoc.id,
                name: userData.name,
                email: userData.email,
                tenthPercentage: userData.tenthPercentage,
                twelfthPercentage: userData.twelfthPercentage,
                graduationCGPA: userData.graduationCGPA,
                backlogs: userData.backlogs,
                gapYears: userData.gapYears,
                gapDuringGrad: userData.gapDuringGrad,
            };
        }

        application.eligibilityCheck = eligibilitySnapshot.empty ? null : eligibilitySnapshot.docs[0].data();

        // Fetch test details for each stage
        application.assessmentStages = await Promise.all(stagesSnapshot.docs.map(async (stageDoc) => {
            const stageData = stageDoc.data();
            let test = null;
            if (stageData.testId) {
                const testDoc = await adminDb.collection("Test").doc(stageData.testId).get();
                if (testDoc.exists) {
                    const td = testDoc.data();
                    test = {
                        id: testDoc.id,
                        title: td?.title,
                        duration: td?.duration
                    };
                }
            }
            return {
                ...stageData,
                id: stageDoc.id,
                test
            };
        }));

        application.voiceAssessment = voiceSnapshot.empty ? null : voiceSnapshot.docs[0].data();

        return NextResponse.json(application);
    } catch (error: any) {
        console.error("Error fetching application:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch application",
                details: error.message
            },
            { status: 500 }
        );
    }
}
