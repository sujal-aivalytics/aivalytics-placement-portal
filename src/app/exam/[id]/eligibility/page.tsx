import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EligibilityClient from "./eligibility-client";

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
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) notFound();
    const userData = userDoc.data() as any;

    return (
        <EligibilityClient 
            testId={id} 
            criteria={testData.eligibilityCriteria} 
            // Passing userData potentially if the client needs it, 
            // or the client might fetch it itself. 
            // Looking at the grep, it only takes testId and criteria.
        />
    );
}
