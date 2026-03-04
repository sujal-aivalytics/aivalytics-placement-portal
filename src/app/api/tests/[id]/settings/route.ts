import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import { NextResponse } from "next/server";
import * as admin from 'firebase-admin';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { eligibilityCriteria } = await req.json();

        await adminDb.collection("Test").doc(id).update({
            eligibilityCriteria: eligibilityCriteria || null,
            updatedAt: admin.firestore.Timestamp.now()
        });

        const testDoc = await adminDb.collection("Test").doc(id).get();

        return NextResponse.json({ id: testDoc.id, ...testDoc.data() });
    } catch (error: any) {
        console.error("[TEST_SETTINGS_PATCH]", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
