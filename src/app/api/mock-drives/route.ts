import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

// GET: List Drives (For Users/Admin)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const drivesSnapshot = await adminDb.collection("MockCompanyDrive").orderBy("createdAt", "desc").get();

        const drives = await Promise.all(drivesSnapshot.docs.map(async (doc: any) => {
            const data = doc.data() as any;

            // Get rounds for this drive
            const roundsSnapshot = await adminDb.collection("MockRound")
                .where("driveId", "==", doc.id)
                .get();

            const rounds = (await Promise.all(roundsSnapshot.docs.map(async (rDoc: any) => {
                const rData = rDoc.data() as any;
                // Get question count for this round
                const questionsSnapshot = await adminDb.collection("MockQuestion")
                    .where("roundId", "==", rDoc.id)
                    .count()
                    .get();

                return {
                    ...rData,
                    id: rDoc.id,
                    _count: {
                        questions: questionsSnapshot.data().count
                    }
                };
            }))).sort((a: any, b: any) => (a.roundNumber || 0) - (b.roundNumber || 0));

            const totalQuestions = rounds.reduce((acc, r) => acc + (r._count?.questions || 0), 0);
            const totalDuration = rounds.reduce((acc, r) => acc + (r.durationMinutes || 0), 0);

            return {
                ...data,
                id: doc.id,
                rounds,
                totalQuestions,
                totalDuration,
                _count: {
                    rounds: rounds.length
                }
            };
        }));

        // Stats Aggregation
        const totalDrives = drives.length;
        const totalQuestionsSnapshot = await adminDb.collection("MockQuestion").count().get();

        const avgDurationSnapshot = await adminDb.collection("MockRound").get();
        let totalRoundDuration = 0;
        avgDurationSnapshot.docs.forEach((d: any) => {
            totalRoundDuration += (d.data().durationMinutes || 0);
        });
        const avgDuration = avgDurationSnapshot.empty ? 0 : Math.round(totalRoundDuration / avgDurationSnapshot.size);

        const uniqueCompanies = new Set(drives.map(d => d.companyName)).size;

        return NextResponse.json({
            drives,
            stats: {
                activeDrives: totalDrives,
                totalQuestions: totalQuestionsSnapshot.data().count,
                avgDuration: avgDuration,
                uniqueCompanies: uniqueCompanies
            }
        });
    } catch (error: any) {
        console.error('Fetch drives error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

// POST: Create Drive (For Admin)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, companyName, description } = body;

        if (!title || !companyName) {
            return NextResponse.json({ error: 'Title and Company Name are required' }, { status: 400 });
        }

        const driveRef = adminDb.collection("MockCompanyDrive").doc();
        const driveData = {
            id: driveRef.id,
            title,
            companyName,
            description: description || '',
            isLive: true,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        };

        await driveRef.set(driveData);

        return NextResponse.json({ drive: driveData }, { status: 201 });
    } catch (error: any) {
        console.error('Create drive error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
