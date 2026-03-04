import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ExamEligibilityPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=/exam/${id}/eligibility`);
    }

    const userId = session.user.id;

    // 1. Fetch Test
    const testDoc = await adminDb.collection("Test").doc(id).get();
    if (!testDoc.exists) notFound();
    const testData = testDoc.data() as any;

    if (!testData.eligibilityCriteria) {
        redirect(`/exam/${id}/dashboard`);
    }

    // 2. Fetch User Profile
    const userDoc = await adminDb.collection("User").doc(userId).get();
    const userData = userDoc.data() as any;

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold mb-6">Eligibility Check</h1>
            <div className="bg-card p-6 rounded-lg border">
                {/* ... Render Eligibility logic and criteria using testData and userData ... */}
            </div>
        </div>
    );
}
