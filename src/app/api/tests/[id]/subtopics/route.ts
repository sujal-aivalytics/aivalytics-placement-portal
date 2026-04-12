import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';
import { loadLocalData, saveLocalData, isLocalhostMode } from '@/lib/local-storage';

// GET - Fetch all subtopics for a test with user progress
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId } = await params;
        let subtopics: any[] = [];
        let fromLocal = false;

        // Try Firebase first
        try {
            const subtopicsSnapshot = await adminDb.collection("Subtopic")
                .where("testId", "==", testId)
                .get();

            subtopics = subtopicsSnapshot.docs
                .map(doc => ({ ...doc.data(), id: doc.id } as any))
                .sort((a, b) => (a.order || 0) - (b.order || 0));
        } catch (firebaseError) {
            console.warn('Firebase subtopics fetch failed:', firebaseError);
        }

        // Fallback to local storage in development mode
        if (subtopics.length === 0 && isLocalhostMode()) {
            const localSubtopics = await loadLocalData('subtopics');
            if (localSubtopics && Array.isArray(localSubtopics)) {
                subtopics = localSubtopics.filter((s: any) => s.testId === testId);
                fromLocal = true;
            }
        }

        // Fetch user progress for these subtopics
        const userId = session.user.id;
        const transformedSubtopics = await Promise.all(subtopics.map(async (subtopic: any) => {
            // Get question count
            let questionCount = 0;
            try {
                const questionCountSnapshot = await adminDb.collection("Question")
                    .where("subtopicId", "==", subtopic.id)
                    .count()
                    .get();
                questionCount = questionCountSnapshot.data().count;
            } catch (e) {
                // Fallback to local question count
                if (isLocalhostMode()) {
                    const localQuestions = await loadLocalData('questions');
                    if (localQuestions && Array.isArray(localQuestions)) {
                        questionCount = localQuestions.filter((q: any) => q.subtopicId === subtopic.id).length;
                    }
                }
            }

            // Get user progress
            let userProgress = null;
            try {
                const progressSnapshot = await adminDb.collection("UserSubtopicProgress")
                    .where("userId", "==", userId)
                    .where("subtopicId", "==", subtopic.id)
                    .limit(1)
                    .get();
                userProgress = progressSnapshot.empty ? null : progressSnapshot.docs[0].data();
            } catch (e) {
                // Ignore progress fetch errors
            }

            return {
                id: subtopic.id,
                name: subtopic.name,
                description: subtopic.description,
                order: subtopic.order,
                roundTitle: subtopic.roundTitle,
                type: subtopic.type,
                totalQuestions: questionCount || subtopic.totalQuestions || 0,
                progress: userProgress
                    ? {
                        score: userProgress.score || 0,
                        total: userProgress.total || 0,
                        percentage: userProgress.percentage || 0,
                        completed: userProgress.completed,
                        attempted: userProgress.attempted,
                    }
                    : null,
            };
        }));

        return NextResponse.json({ 
            subtopics: transformedSubtopics, 
            fromLocal,
            status: 'success'
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching subtopics:', error);
        return NextResponse.json({ error: 'Internal server error', subtopics: [] }, { status: 500 });
    }
}

// POST - Create a new subtopic (Admin only)
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: testId } = await params;

        if (!testId) {
            return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
        }

        const { name, description, order, roundTitle, type } = await req.json();

        if (!name) {
            return NextResponse.json({ error: 'Subtopic name is required' }, { status: 400 });
        }

        // Verify test exists
        const testDoc = await adminDb.collection("Test").doc(testId).get();
        if (!testDoc.exists) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        // Create the subtopic
        const subtopicRef = adminDb.collection("Subtopic").doc();
        const subtopicData = {
            testId,
            name,
            description: description || null,
            order: order || 0,
            roundTitle: roundTitle || null,
            type: type || 'assessment',
            totalQuestions: 0,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        };

        await subtopicRef.set(subtopicData);

        // Also save to local storage for development
        if (isLocalhostMode()) {
            const localSubtopic = { ...subtopicData, id: subtopicRef.id };
            const existing = await loadLocalData('subtopics') || [];
            const updated = Array.isArray(existing) ? [...existing, localSubtopic] : [localSubtopic];
            await saveLocalData('subtopics', updated);
        }

        return NextResponse.json(
            { message: 'Subtopic created successfully', subtopic: { ...subtopicData, id: subtopicRef.id } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Subtopic creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
