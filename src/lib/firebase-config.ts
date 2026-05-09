import "server-only";
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

const initializeAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  try {
    const projectId =
      process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const storageBucket =
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      (projectId ? `${projectId}.firebasestorage.app` : undefined);

    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKeyRaw) {
      const privateKey = privateKeyRaw.replace(/\\n/g, "\n").replace(/^["']|["']$/g, "");

      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
    }

    if (process.env.NODE_ENV !== "production") {
      const jsonPath = path.join(process.cwd(), "firebase-service-account.json");

      if (fs.existsSync(jsonPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket,
        });
      }
    }

    throw new Error("Firebase Admin credentials are missing");
  } catch (error: any) {
    console.error("Firebase Admin initialization failed:", error.message);
    return null;
  }
};

const app = initializeAdmin();
