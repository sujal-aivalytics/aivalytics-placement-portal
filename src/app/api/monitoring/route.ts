import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// POST - Log monitoring event
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { resultId, eventType, metadata } = body;

        if (!resultId || !eventType) {
            return NextResponse.json({ error: 'Result ID and event type are required' }, { status: 400 });
        }

        // Verify the result belongs to the user
        const resultDoc = await adminDb.collection("Result").doc(resultId).get();

        if (!resultDoc.exists || resultDoc.data()?.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const eventRef = adminDb.collection("MonitoringEvent").doc();
        const eventData = {
            id: eventRef.id,
            userId: session.user.id,
            resultId,
            eventType,
            details: metadata ? JSON.stringify(metadata) : null,
            timestamp: admin.firestore.Timestamp.now()
        };

        await eventRef.set(eventData);

        return NextResponse.json({ event: eventData });
    } catch (error: any) {
        console.error('Error logging monitoring event:', error);
        return NextResponse.json({ error: 'Failed to log event', details: error.message }, { status: 500 });
    }
}

// GET - Get monitoring events for a result
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const resultId = searchParams.get('resultId');

        if (!resultId) {
            return NextResponse.json({ error: 'Result ID is required' }, { status: 400 });
        }

        // Verify access (user owns the result or is admin)
        const resultDoc = await adminDb.collection("Result").doc(resultId).get();
        if (!resultDoc.exists) {
            return NextResponse.json({ error: 'Result not found' }, { status: 404 });
        }

        const resultData = resultDoc.data();
        if ((session.user as any).role !== 'admin' && resultData?.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const eventsSnapshot = await adminDb.collection("MonitoringEvent")
            .where("resultId", "==", resultId)
            .orderBy("timestamp", "asc")
            .get();

        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ events });
    } catch (error: any) {
        console.error('Error fetching monitoring events:', error);
        return NextResponse.json({ error: 'Failed to fetch events', details: error.message }, { status: 500 });
    }
}
