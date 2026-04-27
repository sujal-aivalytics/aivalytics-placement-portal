import { adminDb } from "@/lib/firebase-config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookOpen } from "lucide-react";
import ProblemsList from "./ProblemsList";

// FORCE UPDATE 2026-04-26T14:47 — TABLE LAYOUT ACTIVE
export default async function ProgrammingProblemsPage() {
  const session = await getServerSession(authOptions);

  // Fetch all problems — serialize Timestamps to plain strings for Client Component
  const snapshot = await adminDb.collection("Problem").orderBy("createdAt", "desc").get();
  const problems = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null,
    };
  }) as any[];

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto">
        {problems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-200 shadow-sm mt-8">
            <div className="p-6 bg-gray-100 rounded-full mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Problems Yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm text-center font-medium">
              No challenges have been added to the registry yet. Check back soon for fresh modules.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <ProblemsList problems={problems} />
          </div>
        )}
      </div>
    </div>
  );
}
