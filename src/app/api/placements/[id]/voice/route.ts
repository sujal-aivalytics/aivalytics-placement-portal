import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const {
            audioData,
            duration,
            fluencyScore,
            pronunciationScore,
            paceScore,
            clarityScore,
            totalScore,
            isPassed,
        } = body;

        // Fetch application
        const applicationRef = adminDb.collection("PlacementApplication").doc(id);
        const applicationDoc = await applicationRef.get();

        if (!applicationDoc.exists) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const application = applicationDoc.data() as any;

        // Verify application belongs to user or user is admin
        if (application.userId !== session.user.id && (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if voice assessment already exists
        const voiceSnapshot = await adminDb.collection("VoiceAssessment")
            .where("applicationId", "==", id)
            .limit(1)
            .get();

        const existingAssessment = voiceSnapshot.empty ? null : voiceSnapshot.docs[0].data();

        if (existingAssessment?.assessedAt) {
            return NextResponse.json({ error: 'Voice assessment already completed' }, { status: 400 });
        }

        const batch = adminDb.batch();

        // Create or update voice assessment
        const voiceRef = voiceSnapshot.empty ? adminDb.collection("VoiceAssessment").doc() : voiceSnapshot.docs[0].ref;
        const voiceData = {
            id: voiceRef.id,
            applicationId: id,
            audioUrl: audioData,
            fluencyScore,
            pronunciationScore,
            paceScore,
            clarityScore,
            totalScore,
            isPassed,
            assessedAt: admin.firestore.Timestamp.now(),
            feedback: generateVoiceFeedback(fluencyScore, pronunciationScore, paceScore, clarityScore),
        };

        if (voiceSnapshot.empty) {
            batch.set(voiceRef, voiceData);
        } else {
            batch.update(voiceRef, voiceData);
        }

        // Update application status
        const nextStage = isPassed ? 'interview' : 'rejected';
        batch.update(applicationRef, {
            status: nextStage,
            currentStage: 'voice',
            finalDecision: isPassed ? admin.firestore.FieldValue.delete() : 'rejected',
            updatedAt: admin.firestore.Timestamp.now()
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            isPassed,
            nextStage: isPassed ? 'interview' : null,
            scores: {
                fluency: fluencyScore,
                pronunciation: pronunciationScore,
                pace: paceScore,
                clarity: clarityScore,
                overall: totalScore,
            },
        });
    } catch (error: any) {
        console.error('Error submitting voice assessment:', error);
        return NextResponse.json({ error: 'Failed to submit voice assessment', details: error.message }, { status: 500 });
    }
}

function generateVoiceFeedback(fluency: number, pronunciation: number, pace: number, clarity: number): string {
    const feedback: string[] = [];
    if (fluency >= 80) feedback.push('Excellent fluency! You spoke smoothly and confidently.');
    else if (fluency >= 60) feedback.push('Good fluency. Consider practicing to reduce hesitations.');
    else feedback.push('Work on improving fluency by practicing speaking regularly.');

    if (pronunciation >= 80) feedback.push('Great pronunciation! Your words were clear and well-articulated.');
    else if (pronunciation >= 60) feedback.push('Decent pronunciation. Focus on enunciating difficult words.');
    else feedback.push('Improve pronunciation by listening to native speakers and practicing.');

    if (pace >= 80) feedback.push('Perfect speaking pace! Not too fast, not too slow.');
    else if (pace >= 60) feedback.push('Good pace. Try to maintain consistency throughout.');
    else feedback.push('Adjust your speaking pace for better comprehension.');

    if (clarity >= 80) feedback.push('Excellent clarity! Your message was easy to understand.');
    else if (clarity >= 60) feedback.push('Good clarity. Organize your thoughts before speaking.');
    else feedback.push('Improve clarity by structuring your responses better.');

    return feedback.join(' ');
}
