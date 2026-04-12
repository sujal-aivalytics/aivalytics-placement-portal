import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// POST - Create a new question for a mock round
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId, roundId } = await params;
        const body = await req.json();
        const { text, type, metadata, marks, subtopicId, options, correctOptionIndex, codingMetadata } = body;

        if (!text || !type) {
            return NextResponse.json({ error: 'Text and type are required' }, { status: 400 });
        }

        const questionRef = adminDb.collection("MockQuestion").doc();
        const now = admin.firestore.Timestamp.now();

        const questionData = {
            id: questionRef.id,
            roundId,
            driveId,
            text,
            type,
            marks: marks || 1,
            subtopicId: subtopicId || null,
            options: options || null,
            correctOptionIndex: correctOptionIndex !== undefined ? correctOptionIndex : null,
            codingMetadata: codingMetadata || null,
            metadata: typeof metadata === 'object' ? metadata : (metadata ? JSON.parse(metadata) : null),
            createdAt: now,
            updatedAt: now
        };

        await questionRef.set(questionData);

        return NextResponse.json(questionData, { status: 201 });
    } catch (error: any) {
        console.error('Question creation error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// PUT - Update a question
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id: questionId, text, type, metadata } = body;

        if (!questionId) {
            return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
        }

        const questionRef = adminDb.collection("MockQuestion").doc(questionId);
        const questionDoc = await questionRef.get();

        if (!questionDoc.exists) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        const updateData: any = {
            updatedAt: admin.firestore.Timestamp.now()
        };
        if (text !== undefined) updateData.text = text;
        if (type !== undefined) updateData.type = type;
        if (body.marks !== undefined) updateData.marks = body.marks;
        if (body.subtopicId !== undefined) updateData.subtopicId = body.subtopicId;
        if (body.options !== undefined) updateData.options = body.options;
        if (body.correctOptionIndex !== undefined) updateData.correctOptionIndex = body.correctOptionIndex;
        if (body.codingMetadata !== undefined) updateData.codingMetadata = body.codingMetadata;
        if (metadata !== undefined) {
            updateData.metadata = typeof metadata === 'object' ? metadata : (metadata ? JSON.parse(metadata) : null);
        }

        await questionRef.update(updateData);

        return NextResponse.json({ message: 'Question updated successfully' });
    } catch (error: any) {
        console.error('Question update error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// DELETE - Delete a question
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const questionId = searchParams.get('id');

        if (!questionId) {
            return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
        }

        await adminDb.collection("MockQuestion").doc(questionId).delete();

        return NextResponse.json({ message: 'Question deleted successfully' });
    } catch (error: any) {
        console.error('Question deletion error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
