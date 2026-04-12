import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';
import bcrypt from 'bcryptjs';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
    try {
        const { name, email, password, phone, collegeName } = await req.json();

        // Validate input
        if (!name || !email || !password || !collegeName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists in Firestore
        const existingUserSnapshot = await adminDb.collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();

        if (!existingUserSnapshot.empty) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Firestore
        const userRef = adminDb.collection("users").doc();
        const userData = {
            id: userRef.id,
            name,
            email,
            phone,
            collegeName,
            password: hashedPassword,
            role: 'user',
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        };

        await userRef.set(userData);

        // Remove sensitive data before returning
        const { password: _, ...userWithoutPassword } = userData;

        return NextResponse.json(
            { message: 'User created successfully', user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message || 'Internal server error'
            : 'Internal server error';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
