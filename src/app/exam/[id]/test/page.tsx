import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TestRunnerClient from "./test-client";

export default async function TestTakingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=/exam/${id}/test`);
    }

    const userId = session.user.id;

    // 1. Fetch Test with deep joins for subtopics and questions
    const testDoc = await adminDb.collection("Test").doc(id).get();
    if (!testDoc.exists) notFound();
    const testData = testDoc.data() as any;

    // 2. Fetch Subtopics
    const subtopicsSnapshot = await adminDb.collection("Subtopic")
        .where("testId", "==", id)
        .orderBy("order", "asc")
        .get();

    const subtopics = await Promise.all(subtopicsSnapshot.docs.map(async (doc) => {
        const subtopicData = doc.data();

        // Fetch Questions for each subtopic
        const questionsSnapshot = await adminDb.collection("Question")
            .where("subtopicId", "==", doc.id)
            .get();

        const questions = await Promise.all(questionsSnapshot.docs.map(async (qDoc) => {
            const qData = qDoc.data();

            // Fetch Options
            const optionsSnapshot = await adminDb.collection("Option")
                .where("questionId", "==", qDoc.id)
                .get();

            return {
                id: qDoc.id,
                ...qData,
                options: optionsSnapshot.docs.map(oDoc => ({ id: oDoc.id, ...oDoc.data() }))
            };
        }));

        return {
            id: doc.id,
            ...subtopicData,
            questions
        };
    }));

    // 3. Check for active session
    const sessionSnapshot = await adminDb.collection("MockDriveSession")
        .where("userId", "==", userId)
        .where("testId", "==", id)
        .where("status", "==", "active")
        .limit(1)
        .get();

    const activeSession = sessionSnapshot.empty 
        ? null 
        : { id: sessionSnapshot.docs[0].id, ...sessionSnapshot.docs[0].data() };

    return (
        <TestRunnerClient 
            test={{ ...testData, id, subtopics }} 
            session={activeSession} 
        />
    );
}
