import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch counts from Firestore
        const studentsSnapshot = await adminDb.collection("User").where("role", "==", "student").get();
        const totalStudents = studentsSnapshot.size;

        const testsSnapshot = await adminDb.collection("Test").get();
        const totalTests = testsSnapshot.size;

        const applicationsSnapshot = await adminDb.collection("PlacementApplication").get();
        const totalApplications = applicationsSnapshot.size;

        const companiesSnapshot = await adminDb.collection("Placement").get();
        const totalCompanies = companiesSnapshot.size;

        // Calculate Status Distribution
        const statusCounts: Record<string, number> = {};
        applicationsSnapshot.docs.forEach(doc => {
            const status = doc.data().status || 'applied';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count
        }));

        // Fetch Recent Applications
        const recentAppsSnapshot = await adminDb.collection("PlacementApplication")
            .orderBy("createdAt", "desc")
            .limit(5)
            .get();

        const recentApplications = await Promise.all(recentAppsSnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Join User
            const userDoc = await adminDb.collection("User").doc(data.userId).get();
            const userData = userDoc.data();

            // Join Placement
            const placementDoc = await adminDb.collection("Placement").doc(data.placementId).get();
            const placementData = placementDoc.data();

            return {
                id: doc.id,
                status: data.status,
                createdAt: data.createdAt,
                user: { name: userData?.name || 'Unknown' },
                placement: { company: placementData?.company || 'Unknown' }
            };
        }));

        return NextResponse.json({
            stats: {
                totalStudents,
                totalTests,
                totalApplications,
                totalCompanies
            },
            statusDistribution,
            recentApplications
        });
    } catch (error: any) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
