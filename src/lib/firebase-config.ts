import "server-only";
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

const initializeAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    const projectId =
      process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const storageBucket =
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      (projectId ? `${projectId}.firebasestorage.app` : undefined);

    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKeyRaw) {
      const privateKey = privateKeyRaw
        .replace(/\\n/g, "\n")
        .replace(/^["']|["']$/g, "");

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

function createProxy(serviceName: "firestore" | "auth" | "storage") {
  return new Proxy({} as any, {
    get(_target, prop) {
      const isInitialized = admin.apps.length > 0;

      if (prop === "app") {
        return isInitialized ? admin.app() : { name: "[UNINITIALIZED]", options: {} };
      }

      if (prop === "name") {
        return isInitialized ? admin.app().name : "[UNINITIALIZED]";
      }

      if (prop === "settings") {
        return () => {};
      }

      if (typeof prop === "symbol" || prop === "constructor" || prop === "$$typeof") {
        return undefined;
      }

      if (isInitialized) {
        const service = (admin as any)[serviceName]();
        const value = service[prop];
        return typeof value === "function" ? value.bind(service) : value;
      }

      const proxyMethods = ["collection", "doc", "where", "limit", "orderBy", "onSnapshot"];
      if (proxyMethods.includes(prop as string)) {
        return () => createProxy(serviceName);
      }

      return () => {
        throw new Error(`Firebase ${serviceName} is not initialized. Check your credentials.`);
      };
    },
  });
}

export const adminDb = createProxy("firestore") as unknown as admin.firestore.Firestore;
export const adminAuth = createProxy("auth") as unknown as admin.auth.Auth;
export const adminStorage = createProxy("storage") as unknown as admin.storage.Storage;

export default app;
