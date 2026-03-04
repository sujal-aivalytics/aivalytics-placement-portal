import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MockTestPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=/dashboard/mock-tests/${id}`);
    }

    // Fetch Test
    const doc = await adminDb.collection("Test").doc(id).get();
    if (!doc.exists) notFound();
    const test = { id: doc.id, ...doc.data() } as any;

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">{test.title}</h1>
            {/* ... Render Mock Test start UI ... */}
        </div>
    );
}
