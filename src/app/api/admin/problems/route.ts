import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';
import { saveLocalData, appendLocalData, isLocalhostMode } from '@/lib/local-storage';

// GET - List all problems
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const problemsSnapshot = await adminDb.collection("problems")
      .orderBy('createdAt', 'desc')
      .get();

    const problems = problemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ problems });
  } catch (error: any) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new problem
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      constraints,
      difficulty,
      type,
      expectedTime,
      expectedSpace,
      examples,
      starterTemplate,
      driverCode,
      testCases
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const problemRef = adminDb.collection("problems").doc();
    const now = admin.firestore.Timestamp.now();

    const problemData = {
      id: problemRef.id,
      title,
      description,
      constraints: constraints || '',
      difficulty: difficulty || 'Easy',
      type: type || 'DSA',
      expectedTime: expectedTime || 'O(n)',
      expectedSpace: expectedSpace || 'O(1)',
      examples: Array.isArray(examples) ? examples : [],
      starterTemplate: typeof starterTemplate === 'object' ? starterTemplate : {},
      driverCode: typeof driverCode === 'object' ? driverCode : {},
      testCases: Array.isArray(testCases) ? testCases : [],
      createdAt: now,
      updatedAt: now,
      createdBy: session.user.id || session.user.email
    };

    await problemRef.set(problemData);

    // --- LOCALHOST STORAGE ---
    if (isLocalhostMode()) {
      await appendLocalData('problems', problemData);
    }
    // ------------------------

    return NextResponse.json({
      success: true,
      message: 'Problem created successfully',
      problem: problemData,
      savedLocally: isLocalhostMode()
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating problem:', error);
    return NextResponse.json(
      { error: 'Failed to create problem', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update an existing problem
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    const problemRef = adminDb.collection("problems").doc(id);
    const problemDoc = await problemRef.get();

    if (!problemDoc.exists) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    const updatePayload: any = {
      updatedAt: admin.firestore.Timestamp.now()
    };

    // Only update provided fields
    if (updateData.title !== undefined) updatePayload.title = updateData.title;
    if (updateData.description !== undefined) updatePayload.description = updateData.description;
    if (updateData.constraints !== undefined) updatePayload.constraints = updateData.constraints;
    if (updateData.difficulty !== undefined) updatePayload.difficulty = updateData.difficulty;
    if (updateData.type !== undefined) updatePayload.type = updateData.type;
    if (updateData.expectedTime !== undefined) updatePayload.expectedTime = updateData.expectedTime;
    if (updateData.expectedSpace !== undefined) updatePayload.expectedSpace = updateData.expectedSpace;
    if (updateData.examples !== undefined) updatePayload.examples = Array.isArray(updateData.examples) ? updateData.examples : [];
    if (updateData.starterTemplate !== undefined) updatePayload.starterTemplate = typeof updateData.starterTemplate === 'object' ? updateData.starterTemplate : {};
    if (updateData.driverCode !== undefined) updatePayload.driverCode = typeof updateData.driverCode === 'object' ? updateData.driverCode : {};
    if (updateData.testCases !== undefined) updatePayload.testCases = Array.isArray(updateData.testCases) ? updateData.testCases : [];

    await problemRef.update(updatePayload);

    const updatedDoc = await problemRef.get();

    return NextResponse.json({
      success: true,
      message: 'Problem updated successfully',
      problem: { id, ...updatedDoc.data() }
    });

  } catch (error: any) {
    console.error('Error updating problem:', error);
    return NextResponse.json(
      { error: 'Failed to update problem', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a problem
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    await adminDb.collection("problems").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'Problem deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting problem:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem', details: error.message },
      { status: 500 }
    );
  }
}
