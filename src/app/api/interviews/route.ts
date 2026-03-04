import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-config';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let query = adminDb.collection("InterviewSession") as admin.firestore.Query;

    if (session.user.role === 'admin') {
      if (userId) query = query.where("userId", "==", userId);
    } else {
      query = query.where("userId", "==", session.user.id);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    const interviews = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();

      // Join User
      const userDoc = await adminDb.collection("User").doc(data.userId).get();
      const userData = userDoc.data();

      // Join Drive
      const driveDoc = await adminDb.collection("MockCompanyDrive").doc(data.driveId).get();
      const driveData = driveDoc.data();

      return {
        id: doc.id,
        ...data,
        user: userData ? { name: userData.name, email: userData.email } : null,
        drive: driveData ? { company: driveData.company } : null
      };
    }));

    return NextResponse.json(interviews);
  } catch (error: any) {
    console.error('Interviews fetch error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
