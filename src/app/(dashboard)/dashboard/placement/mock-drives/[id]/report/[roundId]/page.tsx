import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MockRoundReportPage({
    params,
}: {
    params: Promise<{ id: string; roundId: string }>;
}) {
    const { id: driveId, roundId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=/dashboard/placement/mock-drives/${driveId}/report/${roundId}`);
    }

    const userId = session.user.id;

    // 1. Fetch Round Progress/Result
    const progressRef = adminDb.collection("MockRoundProgress").doc(`${userId}_${roundId}`);
    const progressDoc = await progressRef.get();

    if (!progressDoc.exists) notFound();
    const progress = progressDoc.data() as any;

    // 2. Fetch Round and Drive info
    const roundDoc = await adminDb.collection("MockRound").doc(roundId).get();
    const round = roundDoc.exists ? (roundDoc.data() as any) : { title: "Round" };

    const driveDoc = await adminDb.collection("MockCompanyDrive").doc(driveId).get();
    const drive = driveDoc.exists ? driveDoc.data() : { company: "Company" };

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold mb-6">Performance Report: {round.title}</h1>
            {/* ... Render Report UI with progress, round, and drive data ... */}
        </div>
    );
}
