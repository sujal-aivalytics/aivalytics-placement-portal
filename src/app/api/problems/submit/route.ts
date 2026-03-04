// src/app/api/problems/submit/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { problemId, userCode, language, status } = body;

    if (!problemId || !userCode || !language) {
      return NextResponse.json(
        { error: "problemId, userCode and language are required" },
        { status: 400 }
      );
    }

    // Since Firebase doesn't have a direct equivalent to a 3-field composite unique key for upsert easily,
    // we query first or use a deterministic doc ID.
    // Deterministic ID: userId_problemId_language (slugified/joined)
    const submissionId = `${session.user.id}_${problemId}_${language}`;
    const submissionRef = adminDb.collection("Submissions").doc(submissionId);

    const submissionData = {
      userId: session.user.id,
      problemId: problemId, // Keep as string or convert if needed, Prisma used Number(problemId)
      language,
      code: userCode,
      status: status || "Pending",
      updatedAt: admin.firestore.Timestamp.now()
    };

    const doc = await submissionRef.get();
    if (doc.exists) {
      await submissionRef.update(submissionData);
    } else {
      await submissionRef.set({
        ...submissionData,
        id: submissionId,
        createdAt: admin.firestore.Timestamp.now()
      });
    }

    return NextResponse.json(
      { message: "Code submitted successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("SUBMIT_CODE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
