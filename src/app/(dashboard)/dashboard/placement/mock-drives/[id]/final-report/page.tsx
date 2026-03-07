import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MockFinalReportPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: driveId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=/dashboard/placement/mock-drives/${driveId}/final-report`);
    }

    const userId = session.user.id;

    // 1. Fetch Enrollment
    const enrollmentRef = adminDb.collection("MockDriveEnrollment").doc(`${userId}_${driveId}`);
    const enrollmentDoc = await enrollmentRef.get();

    if (!enrollmentDoc.exists) notFound();
    const enrollment = enrollmentDoc.data() as any;

    // 2. Fetch all Round Progress for this drive
    const progressSnapshot = await adminDb.collection("MockRoundProgress")
        .where("userId", "==", userId)
        .where("driveId", "==", driveId)
        .get();

    const progressList = progressSnapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));

    // 3. Fetch Drive details
    const driveDoc = await adminDb.collection("MockCompanyDrive").doc(driveId).get();
    const drive = driveDoc.exists ? driveDoc.data() : { company: "Company" };

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold text-center mb-12">Final Placement Report</h1>
            {/* ... Render Cumulative Report UI with enrollment, progressList, and drive data ... */}
        </div>
    );
}
