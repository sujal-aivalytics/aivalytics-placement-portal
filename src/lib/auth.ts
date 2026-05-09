import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { adminDb } from "@/lib/firebase-config";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: FirestoreAdapter(adminDb) as any,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log('❌ Login failed: Missing credentials');
                        throw new Error('Missing credentials');
                    }

                    console.log('🔄 Attempting login for:', credentials.email);

                    // Find user in Firestore
                    const userSnapshot = await adminDb.collection("users")
                        .where("email", "==", credentials.email)
                        .limit(1)
                        .get();

                    if (userSnapshot.empty) {
                        console.log('❌ Login failed: User not found');
                        throw new Error('Invalid credentials');
                    }

                    const userDoc = userSnapshot.docs[0];
                    const user = userDoc.data();

                    if (!user.password) {
                        console.log('❌ Login failed: User has no password (maybe Google login?)');
                        throw new Error('Invalid credentials');
                    }

                    // Verify password
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        console.log('❌ Login failed: Invalid password');
                        throw new Error('Invalid credentials');
                    }

                    console.log('✅ Login successful for:', user.email);

                    // Return user object with role
                    return {
                        id: userDoc.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role as "admin" | "user",
                    };
                } catch (error) {
                    console.error('❌ Authorization error:', error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.isProfileComplete = false; // Default
            }

            if (token.sub || token.email) {
                // Try by ID first, then by Email
                let userDoc = token.sub ? await adminDb.collection("users").doc(token.sub).get() : null;
                let dbUser = userDoc?.exists ? userDoc.data() : null;

                if (!dbUser && token.email) {
                    const emailSnap = await adminDb.collection("users")
                        .where("email", "==", token.email)
                        .limit(1)
                        .get();
                    if (!emailSnap.empty) {
                        dbUser = emailSnap.docs[0].data();
                        // Sync token.sub if it was wrong
                        token.sub = emailSnap.docs[0].id;
                    }
                }

                if (dbUser) {
                    token.role = dbUser.role as "admin" | "user";
                    const isComplete = !!(
                        dbUser.phone &&
                        dbUser.name &&
                        dbUser.email
                    );
                    token.isProfileComplete = isComplete;
                    console.log(`[AUTH] Token sync success: email=${dbUser.email}, isComplete=${isComplete}`);
                } else {
                    console.log(`[AUTH] User fallback failed for: ${token.email || token.sub}`);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.sub!;
                (session.user as any).isProfileComplete = token.isProfileComplete;
                console.log(`[AUTH] Session created for user=${session.user.email}, id=${token.sub}, role=${token.role}, isComplete=${token.isProfileComplete}`);
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    debug: process.env.NODE_ENV === 'development',
};
