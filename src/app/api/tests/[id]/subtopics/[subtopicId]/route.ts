import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// DELETE - Delete a subtopic (Admin only)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; subtopicId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId, subtopicId } = await params;

        const subtopicDoc = await adminDb.collection("Subtopic").doc(subtopicId).get();
        if (!subtopicDoc.exists || subtopicDoc.data()?.testId !== testId) {
            return NextResponse.json({ error: 'Subtopic not found or does not belong to this test' }, { status: 404 });
        }

        await adminDb.collection("Subtopic").doc(subtopicId).delete();

        return NextResponse.json({ message: 'Subtopic deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Subtopic deletion error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// PUT - Update a subtopic (Admin only)
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string; subtopicId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId, subtopicId } = await params;
        const body = await req.json();
        const { name, description, order, roundTitle, type } = body;

        const subtopicDoc = await adminDb.collection("Subtopic").doc(subtopicId).get();
        if (!subtopicDoc.exists || subtopicDoc.data()?.testId !== testId) {
            return NextResponse.json({ error: 'Subtopic not found or does not belong to this test' }, { status: 404 });
        }

        const subtopicData = subtopicDoc.data() as any;

        const updateData = {
            name: name || subtopicData.name,
            description: description !== undefined ? description : subtopicData.description,
            order: order !== undefined ? order : subtopicData.order,
            roundTitle: roundTitle !== undefined ? roundTitle : subtopicData.roundTitle,
            type: type !== undefined ? type : subtopicData.type,
            updatedAt: admin.firestore.Timestamp.now()
        };

        await adminDb.collection("Subtopic").doc(subtopicId).update(updateData);

        return NextResponse.json({ message: 'Subtopic updated successfully', subtopic: { ...subtopicData, ...updateData, id: subtopicId } }, { status: 200 });
    } catch (error: any) {
        console.error('Subtopic update error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
