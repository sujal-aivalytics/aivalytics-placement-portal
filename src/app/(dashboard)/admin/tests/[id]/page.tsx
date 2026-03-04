import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminTestPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
        redirect('/login');
    }

    // 1. Fetch Test
    const testDoc = await adminDb.collection("Test").doc(id).get();
    if (!testDoc.exists) notFound();
    const test = { id: testDoc.id, ...testDoc.data() } as any;

    // 2. Fetch Subtopics and Questions for admin view
    const subtopicsSnapshot = await adminDb.collection("Subtopic")
        .where("testId", "==", id)
        .orderBy("order", "asc")
        .get();

    const subtopics = await Promise.all(subtopicsSnapshot.docs.map(async (doc) => {
        const questionsSnapshot = await adminDb.collection("Question")
            .where("subtopicId", "==", doc.id)
            .get();

        return {
            id: doc.id,
            ...doc.data(),
            _count: { questions: questionsSnapshot.size }
        };
    }));

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">{test.title} Details (Admin)</h1>
            {/* ... Render Admin UI with test and subtopics ... */}
        </div>
    );
}
