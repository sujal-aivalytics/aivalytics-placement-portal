import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ExamResultPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ resultId?: string }>;
}) {
    const { id } = await params;
    const { resultId } = await searchParams;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=/exam/${id}/result`);
    }

    if (!resultId) {
        redirect(`/exam/${id}/dashboard`);
    }

    // 1. Fetch Result
    const resultDoc = await adminDb.collection("Result").doc(resultId).get();
    if (!resultDoc.exists) notFound();
    const resultData = resultDoc.data() as any;

    // Verify ownership
    if (resultData.userId !== session.user.id) {
        redirect(`/exam/${id}/dashboard`);
    }

    // 2. Fetch Test details
    const testDoc = await adminDb.collection("Test").doc(id).get();
    const testData = testDoc.exists ? testDoc.data() : { title: "Assessment" };

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold text-center mb-8">Test Result</h1>
            <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-lg p-8 border">
                <div className="text-center mb-8">
                    <p className="text-muted-foreground text-lg mb-2">{testData?.title}</p>
                    <div className="text-6xl font-extrabold text-primary">
                        {resultData.score}%
                    </div>
                </div>
                {/* ... Render more details with resultData ... */}
            </div>
        </div>
    );
}
