import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import * as admin from 'firebase-admin';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userSnapshot = await adminDb.collection("users")
            .where("email", "==", session.user.email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userData = userSnapshot.docs[0].data();

        // Pick only necessary fields (matching the previous Prisma select)
        const profile = {
            name: userData.name,
            email: userData.email,
            image: userData.image,
            coverImage: userData.coverImage,
            phone: userData.phone,
            accountType: userData.accountType,
            autoPayout: userData.autoPayout,
            role: userData.role,
            graduationCGPA: userData.graduationCGPA,
            tenthPercentage: userData.tenthPercentage,
            twelfthPercentage: userData.twelfthPercentage,
            notifications: userData.notifications || { email: true, push: true, newsletter: true },
        };

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();

        // Robust Validation
        const errors: Record<string, string> = {};

        if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters long";
        }

        if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Invalid email address";
        }

        if (!data.phone || typeof data.phone !== 'string' || !/^\d{10}$/.test(data.phone)) {
            errors.phone = "Phone number must be exactly 10 digits";
        }

        const parseNumeric = (val: any) => {
            if (val === null || val === undefined || val === '') return null;
            const parsed = parseFloat(val);
            return isNaN(parsed) ? 'INVALID' : parsed;
        };

        const cgpa = parseNumeric(data.graduationCGPA);
        if (cgpa === 'INVALID' || (typeof cgpa === 'number' && (cgpa < 0 || cgpa > 10))) {
            errors.graduationCGPA = "CGPA must be between 0 and 10";
        }

        const tenth = parseNumeric(data.tenthPercentage);
        if (tenth === 'INVALID' || (typeof tenth === 'number' && (tenth < 0 || tenth > 100))) {
            errors.tenthPercentage = "10th percentage must be between 0 and 100";
        }

        const twelfth = parseNumeric(data.twelfthPercentage);
        if (twelfth === 'INVALID' || (typeof twelfth === 'number' && (twelfth < 0 || twelfth > 100))) {
            errors.twelfthPercentage = "12th percentage must be between 0 and 100";
        }

        if (Object.keys(errors).length > 0) {
            console.warn("Profile Validation Failed:", { email: session.user.email, errors, dataReceived: data });
            return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
        }

        const validatedCGPA = typeof cgpa === 'number' ? cgpa : null;
        const validatedTenth = typeof tenth === 'number' ? tenth : null;
        const validatedTwelfth = typeof twelfth === 'number' ? twelfth : null;

        const userSnapshot = await adminDb.collection("users")
            .where("email", "==", session.user.email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userDoc = userSnapshot.docs[0];
        const updateData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            accountType: data.accountType,
            image: data.image,
            coverImage: data.coverImage,
            autoPayout: data.autoPayout,
            graduationCGPA: validatedCGPA,
            tenthPercentage: validatedTenth,
            twelfthPercentage: validatedTwelfth,
            notifications: data.notifications || { email: true, push: true, newsletter: true },
            updatedAt: admin.firestore.Timestamp.now()
        };

        await userDoc.ref.update(updateData);

        return NextResponse.json({ id: userDoc.id, ...updateData });
    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
    }
}
