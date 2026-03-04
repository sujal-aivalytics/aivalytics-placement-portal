import { adminDb } from "@/lib/firebase-config";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CodeWorkspace from "./CodeWorkspace";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/dashboard/programming/${problemId}`);
  }

  // Fetch Problem
  const doc = await adminDb.collection("Problem").doc(problemId).get();
  if (!doc.exists) notFound();

  const problemData = doc.data() as any;

  // Sanitize: Convert Firestore Timestamps to plain objects (ISO strings)
  // because Next.js cannot pass Classes (Timestamps) to Client Components.
  const problem = {
    ...problemData,
    id: doc.id,
    id_alias: doc.id,
    createdAt: problemData.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: problemData.updatedAt?.toDate?.()?.toISOString() || null,
  };

  return (
    <div className="h-screen bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <CodeWorkspace problem={problem} />
    </div>
  );
}
