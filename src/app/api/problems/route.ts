import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';

// POST: Create a new problem
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      difficulty,
      type,
      expectedTime,
      expectedSpace,
      examples,
      starterTemplate,
      driverCode,
      testCases,
      constraints,
    } = body;

    const slug =
      body.slug ??
      title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (!title?.trim() || !slug?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Title, slug and description are required" },
        { status: 400 }
      );
    }

    const problemRef = adminDb.collection("Problem").doc();
    const problemData = {
      id: problemRef.id,
      title,
      slug,
      description,
      constraints: constraints || null,
      difficulty: difficulty || "Medium",
      type: type || "coding",
      expectedTime: expectedTime || null,
      expectedSpace: expectedSpace || null,
      examples: examples || [],
      starterTemplate: starterTemplate || {},
      driverCode: driverCode || {},
      testCases: testCases || [],
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    };

    await problemRef.set(problemData);

    return NextResponse.json({ success: true, problem: problemData });
  } catch (error: any) {
    console.error('Create Problem Error:', error);
    return NextResponse.json(
      { error: "Failed to create problem", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all problems
export async function GET() {
  try {
    const snapshot = await adminDb.collection("Problem").orderBy("createdAt", "desc").get();
    const problems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ problems });
  } catch (error: any) {
    console.error('Fetch Problems Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch problems", details: error.message },
      { status: 500 }
    );
  }
}
