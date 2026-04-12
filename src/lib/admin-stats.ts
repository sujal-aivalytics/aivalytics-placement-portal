import { adminDb } from "@/lib/firebase-config";

export async function getDashboardStats() {
    try {
        const [
            totalStudentsSnapshot,
            totalClassesSnapshot,
            coursesInProgressSnapshot,
            coursesCompletedSnapshot,
            recentAppsSnapshot,
            recentUsersSnapshot,
            statusDistSnapshot
        ] = await Promise.all([
            adminDb.collection("users").where("role", "==", "user").count().get(),
            adminDb.collection("tests").count().get(),
            adminDb.collection("placementApplications").where("status", "not-in", ["completed", "rejected", "withdrawn"]).count().get(),
            adminDb.collection("placementApplications").where("status", "==", "completed").count().get(),
            adminDb.collection("placementApplications").orderBy("createdAt", "desc").limit(5).get(),
            adminDb.collection("users").orderBy("createdAt", "desc").limit(3).get(),
            adminDb.collection("placementApplications").select("status").get()
        ]);

        const totalStudents = totalStudentsSnapshot.data().count;
        const totalClasses = totalClassesSnapshot.data().count;
        const coursesInProgress = coursesInProgressSnapshot.data().count;
        const coursesCompleted = coursesCompletedSnapshot.data().count;

        // Manual grouping for statusDistribution since Firestore doesn't support groupBy yet in Node SDK directly like Prisma
        const statusMap: Record<string, number> = {};
        statusDistSnapshot.docs.forEach(doc => {
            const status = doc.get("status");
            statusMap[status] = (statusMap[status] || 0) + 1;
        });
        const statusDistribution = Object.entries(statusMap).map(([status, count]) => ({
            status,
            _count: { status: count }
        }));

        const recentApplications = await Promise.all(recentAppsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const userDoc = await adminDb.collection("users").doc(data.userId).get();
            const userData = userDoc.data();
            return {
                ...data,
                id: doc.id,
                user: userData ? { name: userData.name, image: userData.image, email: userData.email } : null
            };
        }));

        const recentUsers = recentUsersSnapshot.docs.map(doc => {
            const data = doc.data();
            return { name: data.name, email: data.email, role: data.role };
        });

        const activities = [
            ...recentUsers.map((u: any) => ({
                id: u.email,
                type: 'user_signup',
                title: 'New User Registered',
                description: `${u.name} (${u.role}) joined the platform`,
                time: 'Just now'
            })),
            {
                id: 'system_1',
                type: 'system',
                title: 'System Update',
                description: 'Server maintenance scheduled for Sunday',
                time: '2 hours ago'
            },
            {
                id: 'report_1',
                type: 'report',
                title: 'Monthly Report Ready',
                description: 'January placement analytics are available',
                time: '5 hours ago'
            }
        ];

        return {
            totalStudents,
            totalClasses,
            coursesInProgress,
            coursesCompleted,
            statusDistribution,
            recentApplications,
            recentActivities: activities
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return {
            totalStudents: 0,
            totalClasses: 0,
            coursesInProgress: 0,
            coursesCompleted: 0,
            statusDistribution: [],
            recentApplications: [],
            recentActivities: []
        };
    }
}
