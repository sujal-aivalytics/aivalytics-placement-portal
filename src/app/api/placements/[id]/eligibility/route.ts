import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';

interface EligibilityData {
    tenthPercentage: number;
    twelfthPercentage: number;
    graduationCGPA: number;
    backlogs: number;
    gapYears: number;
    gapDuringGrad: boolean;
}

function checkEligibility(company: string, data: EligibilityData): { isEligible: boolean; reasons: string[] } {
    const reasons: string[] = [];
    const gradPercentage = data.graduationCGPA * 9.5;

    if (data.tenthPercentage < 60) reasons.push("10th percentage is below 60%");
    if (data.twelfthPercentage < 60) reasons.push("12th percentage is below 60%");
    if (gradPercentage < 60) reasons.push("Graduation percentage is below 60% (CGPA < 6.0)");
    if (data.backlogs > 1) reasons.push("More than 1 active backlog");

    if (company === "TCS") {
        if (data.gapYears > 2) reasons.push("Gap in education exceeds 24 months");
    } else if (company === "Wipro") {
        if (data.gapYears > 3) reasons.push("Gap before graduation exceeds 3 years");
        if (data.gapDuringGrad) reasons.push("Gap during graduation is not allowed");
    }

    return {
        isEligible: reasons.length === 0,
        reasons,
    };
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const appRef = adminDb.collection("PlacementApplication").doc(id);
        const applicationDoc = await appRef.get();

        if (!applicationDoc.exists) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const application = applicationDoc.data() as any;

        if (application.userId !== session.user.id && (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (application.status !== "eligibility_check") {
            return NextResponse.json({ error: "Eligibility check already completed" }, { status: 400 });
        }

        const data: EligibilityData = await request.json();

        // Check eligibility
        const eligibilityResult = checkEligibility(application.company, data);

        const batch = adminDb.batch();

        // Update user's academic details
        const userRef = adminDb.collection("User").doc(session.user.id);
        batch.update(userRef, {
            tenthPercentage: data.tenthPercentage,
            twelfthPercentage: data.twelfthPercentage,
            graduationCGPA: data.graduationCGPA,
            backlogs: data.backlogs,
            gapYears: data.gapYears,
            gapDuringGrad: data.gapDuringGrad,
            updatedAt: admin.firestore.Timestamp.now()
        });

        // Create eligibility check record
        const eligibilityRef = adminDb.collection("EligibilityCheck").doc();
        batch.set(eligibilityRef, {
            id: eligibilityRef.id,
            applicationId: id,
            tenthPercentage: data.tenthPercentage,
            twelfthPercentage: data.twelfthPercentage,
            graduationCGPA: data.graduationCGPA,
            backlogs: data.backlogs,
            gapYears: data.gapYears,
            gapDuringGrad: data.gapDuringGrad,
            isEligible: eligibilityResult.isEligible,
            rejectionReasons: eligibilityResult.reasons.join("; "),
            createdAt: admin.firestore.Timestamp.now()
        });

        // Update application status
        const newStatus = eligibilityResult.isEligible
            ? (application.company === "TCS" ? "foundation" : "aptitude")
            : "rejected";

        batch.update(appRef, {
            status: newStatus,
            eligibilityStatus: eligibilityResult.isEligible ? "eligible" : "rejected",
            currentStage: eligibilityResult.isEligible
                ? (application.company === "TCS" ? "foundation" : "aptitude")
                : null,
            finalDecision: eligibilityResult.isEligible ? admin.firestore.FieldValue.delete() : "rejected",
            updatedAt: admin.firestore.Timestamp.now()
        });

        await batch.commit();

        return NextResponse.json({
            application: { ...application, status: newStatus },
            eligibility: eligibilityResult,
        });
    } catch (error: any) {
        console.error("Error processing eligibility check:", error);
        return NextResponse.json({ error: "Failed to process eligibility check", details: error.message }, { status: 500 });
    }
}
