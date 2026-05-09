import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { adminDb } from "@/lib/firebase-config";
import bcrypt from "bcryptjs";
import * as admin from "firebase-admin";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

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
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const userSnapshot = await adminDb
            .collection("users")
            .where("email", "==", credentials.email)
            .limit(1)
            .get();

          if (userSnapshot.empty) {
            return null;
          }

          const userDoc = userSnapshot.docs[0];
          const user = userDoc.data();

          if (!user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: userDoc.id,
            name: user.name,
            email: user.email,
            image: user.image ?? null,
            role: user.role ?? "user",
          };
        } catch (error) {
          console.error("Credentials authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      try {
        const now = admin.firestore.Timestamp.now();
        const existingUserSnapshot = await adminDb
          .collection("users")
          .where("email", "==", user.email)
          .limit(1)
          .get();

        if (existingUserSnapshot.empty) {
          const userRef = adminDb.collection("users").doc();

          await userRef.set({
            id: userRef.id,
            name: user.name ?? "",
            email: user.email,
            image: user.image ?? null,
            phone: "",
            collegeName: "",
            role: "user",
            createdAt: now,
            updatedAt: now,
          });

          (user as any).id = userRef.id;
        } else {
          const existingDoc = existingUserSnapshot.docs[0];

          await existingDoc.ref.set(
            {
              name: user.name ?? existingDoc.data().name ?? "",
              email: user.email,
              image: user.image ?? null,
              updatedAt: now,
            },
            { merge: true }
          );

          (user as any).id = existingDoc.id;
        }

        return true;
      } catch (error) {
        console.error("Google signIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      try {
        const email = user?.email ?? token.email;

        if (!email) {
          return token;
        }

        const userSnapshot = await adminDb
          .collection("users")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const dbUser = userDoc.data();

          token.sub = userDoc.id;
          token.email = dbUser.email ?? email;
          token.name = dbUser.name ?? token.name;
          token.picture = dbUser.image ?? token.picture;
          (token as any).role = dbUser.role ?? "user";
          (token as any).isProfileComplete = !!(
            dbUser.phone &&
            dbUser.name &&
            dbUser.email
          );
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role ?? "user";
        (session.user as any).isProfileComplete =
          (token as any).isProfileComplete ?? false;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NEXTAUTH_ERROR", code, metadata);
    },
  },
};
