import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId } = await params;
        const userId = session.user.id;

        // 1. Fetch Enrollment
        const enrollmentRef = adminDb.collection("MockDriveEnrollment").doc(`${userId}_${driveId}`);
        const enrollmentDoc = await enrollmentRef.get();

        if (!enrollmentDoc.exists) {
            return NextResponse.json({ error: 'Not enrolled' }, { status: 404 });
        }

        const enrollment = enrollmentDoc.data() as any;

        // 2. Fetch Drive details
        const driveDoc = await adminDb.collection("MockCompanyDrive").doc(driveId).get();
        const drive = driveDoc.exists ? driveDoc.data() : { companyName: "Company", title: "Drive" };

        // 3. Fetch all Rounds for this drive
        const roundsSnapshot = await adminDb.collection("MockRound")
            .where("driveId", "==", driveId)
            .orderBy("roundNumber", "asc")
            .get();

        const rounds = roundsSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        // 4. Fetch all Round Progress for this user and drive
        const progressSnapshot = await adminDb.collection("MockRoundProgress")
            .where("userId", "==", userId)
            .where("driveId", "==", driveId)
            .get();

        const progressList = progressSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        // 5. Merge rounds with progress
        const roundResults = rounds.map((round: any) => {
            const progress = progressList.find((p: any) => p.roundId === round.id);
            return {
                id: progress?.id || round.id,
                roundId: round.id,
                roundTitle: round.title || "Round",
                roundType: round.type || "mcq",
                score: progress?.score || 0,
                totalQuestions: progress?.totalQuestions || 0,
                answeredQuestions: progress?.answeredQuestions || 0,
                status: progress?.status || "NOT_STARTED",
                completedAt: progress?.completedAt?.toDate?.() || progress?.completedAt,
                aiFeedback: progress?.aiFeedback || null
            };
        });

        // 6. Build the final report
        const driveData = drive || { title: "Drive", companyName: "Company" };
        const report = {
            id: enrollment.id,
            driveId: driveId,
            driveTitle: driveData.title || `${driveData.companyName} Drive`,
            companyName: driveData.companyName || "Company",
            overallScore: enrollment.overallScore || 0,
            status: enrollment.status || "IN_PROGRESS",
            completedAt: enrollment.completedAt?.toDate?.() || enrollment.completedAt,
            startedAt: enrollment.createdAt?.toDate?.() || enrollment.createdAt,
            rounds: roundResults
        };

        return NextResponse.json(report);

    } catch (error: any) {
        console.error('Final report error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message }, 
            { status: 500 }
        );
    }
}
