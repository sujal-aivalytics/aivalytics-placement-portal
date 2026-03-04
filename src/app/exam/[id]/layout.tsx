import { adminDb } from "@/lib/firebase-config";
import { notFound } from "next/navigation";

export default async function ExamLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Fetch Test
    const testDoc = await adminDb.collection("Test").doc(id).get();

    if (!testDoc.exists) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    );
}
