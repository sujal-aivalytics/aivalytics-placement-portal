import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ExamDashboardPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=/exam/${id}/dashboard`);
    }

    const userId = session.user.id;

    // 1. Fetch Test
    const testDoc = await adminDb.collection("Test").doc(id).get();
    if (!testDoc.exists) notFound();
    const testData = testDoc.data() as any;

    // 2. Fetch User Results for this test
    const resultsSnapshot = await adminDb.collection("Result")
        .where("testId", "==", id)
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    const history = resultsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    // 3. Check for active session if any
    const sessionSnapshot = await adminDb.collection("MockDriveSession")
        .where("userId", "==", userId)
        .where("testId", "==", id)
        .where("status", "==", "active")
        .limit(1)
        .get();

    const activeSession = sessionSnapshot.empty ? null : sessionSnapshot.docs[0].data();

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">{testData.title}</h1>
            {/* ... Render UI components with testData, history, and activeSession ... */}
        </div>
    );
}
