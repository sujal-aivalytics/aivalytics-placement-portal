import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ExamPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=/exam/${id}`);
    }

    // Fetch Test
    const testDoc = await adminDb.collection("Test").doc(id).get();

    if (!testDoc.exists) {
        notFound();
    }

    // Check if redirect to dashboard is needed or direct to test
    redirect(`/exam/${id}/dashboard`);
}
