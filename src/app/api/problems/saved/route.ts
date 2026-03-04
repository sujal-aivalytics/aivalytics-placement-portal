import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("problemId");
    const language = searchParams.get("language");

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!problemId || !language) {
      return NextResponse.json({ error: "problemId and language are required" }, { status: 400 });
    }

    // Query for the specific submission
    // Since we used deterministic IDs in submit/route.ts, we can try direct fetch first
    const submissionId = `${session.user.id}_${problemId}_${language}`;
    const submissionDoc = await adminDb.collection("Submissions").doc(submissionId).get();

    if (!submissionDoc.exists) {
      // Fallback or just return null code
      return NextResponse.json({ code: null }, { status: 200 });
    }

    return NextResponse.json({ id: submissionDoc.id, ...submissionDoc.data() }, { status: 200 });

  } catch (error: any) {
    console.error("FETCH_SAVED_CODE_ERROR:", error.message);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
