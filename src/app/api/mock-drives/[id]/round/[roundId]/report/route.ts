import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; roundId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: driveId, roundId } = await params;
        const userId = session.user.id;

        // 1. Fetch Round Progress/Result
        const progressRef = adminDb.collection("MockRoundProgress").doc(`${userId}_${roundId}`);
        const progressDoc = await progressRef.get();

        if (!progressDoc.exists) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        const progress = progressDoc.data() as any;

        // 2. Fetch Round details
        const roundDoc = await adminDb.collection("MockRound").doc(roundId).get();
        const round = roundDoc.exists ? roundDoc.data() : { title: "Round", type: "mcq" };

        // 3. Fetch Drive details
        const driveDoc = await adminDb.collection("MockCompanyDrive").doc(driveId).get();
        const drive = driveDoc.exists ? driveDoc.data() : { companyName: "Company" };

        // 4. Fetch Proctoring Anomalies
        const anomaliesSnapshot = await adminDb.collection("ProctoringAnomaly")
            .where("userId", "==", userId)
            .where("roundId", "==", roundId)
            .orderBy("timestamp", "desc")
            .get();

        const anomalies = anomaliesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                type: data.type || "unknown",
                details: data.details || "Anomaly detected",
                timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
                severity: data.severity || "medium"
            };
        });

        // 5. Calculate proctoring stats
        const tabSwitches = anomalies.filter(a => a.type === "tab_switch" || a.type === "TAB_SWITCH").length;
        const fullscreenExits = anomalies.filter(a => a.type === "fullscreen_exit" || a.type === "FULLSCREEN_EXIT").length;
        const faceDetectionFails = anomalies.filter(a => 
            a.type === "face_not_detected" || 
            a.type === "FACE_NOT_DETECTED" ||
            a.type === "multiple_faces" ||
            a.type === "MULTIPLE_FACES"
        ).length;

        // 6. Build the report
        const roundData = round || { title: "Round", type: "mcq" };
        const report = {
            id: progress.id,
            roundId: roundId,
            roundTitle: roundData.title || "Round",
            roundType: roundData.type || "mcq",
            score: progress.score || 0,
            totalQuestions: progress.totalQuestions || 0,
            answeredQuestions: progress.answeredQuestions || 0,
            correctAnswers: progress.correctAnswers || 0,
            status: progress.status || "IN_PROGRESS",
            completedAt: progress.completedAt?.toDate?.() ? progress.completedAt.toDate().toISOString() : null,
            timeTaken: progress.timeTaken || progress.duration || null,
            aiFeedback: progress.aiFeedback || progress.aiEvaluation || null,
            proctoring: {
                totalAnomalies: anomalies.length,
                anomalies: anomalies,
                tabSwitches,
                fullscreenExits,
                faceDetectionFails,
                startTime: progress.startedAt?.toDate?.() ? progress.startedAt.toDate().toISOString() : null,
                endTime: progress.completedAt?.toDate?.() ? progress.completedAt.toDate().toISOString() : null,
            }
        };

        return NextResponse.json(report);

    } catch (error: any) {
        console.error('Round report error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
