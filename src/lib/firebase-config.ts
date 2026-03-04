import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

/**
 * FORCED INITIALIZATION
 * We prioritize the local JSON file because .env is prone to truncation.
 */
const initializeAdmin = () => {
    if (admin.apps.length > 0) return admin.app();

    try {
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        // Modern Firebase buckets often use .firebasestorage.app
        const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (projectId ? `${projectId}.firebasestorage.app` : undefined);

        console.log(`📡 Firebase Admin Init: Project=${projectId}, Bucket=${storageBucket}`);

        // 1. Try local verified JSON file (Most Reliable)
        const jsonPath = path.join(process.cwd(), 'firebase-service-account.json');
        if (fs.existsSync(jsonPath)) {
            console.log('📂 Firebase Admin: Initializing from firebase-service-account.json');
            const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            return admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket
            });
        }

        // 2. Try environment variables (Fallback)
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

        if (projectId && clientEmail && privateKeyRaw) {
            console.log('🔑 Firebase Admin: Falling back to .env credentials');
            let privateKey = privateKeyRaw.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '');
            if (!privateKey.includes('END PRIVATE KEY')) {
                console.warn('⚠️  Firebase Admin: Private key in .env seems truncated. Attempting recovery...');
                // Attempt basic recovery if markers are missing
                if (!privateKey.includes('BEGIN PRIVATE KEY')) privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}`;
                privateKey = `${privateKey}\n-----END PRIVATE KEY-----\n`;
            }

            return admin.initializeApp({
                credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
                storageBucket
            });
        }

        console.warn('⚠️  Firebase Admin: No credentials found. Setup firebase-service-account.json');
        return null;
    } catch (error: any) {
        console.error('❌ Firebase Admin: Initialization Error:', error.message);
        return null;
    }
};

// Start
const app = initializeAdmin();

/**
 * ROBUST EXPORTS
 * We export the real services if available, otherwise a Proxy that 
 * satisfies library constructors but throws on real execution.
 */
function createProxy(serviceName: 'firestore' | 'auth' | 'storage') {
    return new Proxy({} as any, {
        get(target, prop) {
            // Check initialization on every access
            const isInitialized = admin.apps.length > 0;

            // satisfy NextAuth adapter properties
            if (prop === 'app') return isInitialized ? admin.app() : { name: '[UNINITIALIZED]', options: {} };
            if (prop === 'name') return isInitialized ? admin.app().name : '[UNINITIALIZED]';
            if (prop === 'settings') return () => { };
            if (typeof prop === 'symbol' || prop === 'constructor' || prop === '$$typeof') return undefined;

            if (isInitialized) {
                const service = (admin as any)[serviceName]();
                const value = service[prop];
                return typeof value === 'function' ? value.bind(service) : value;
            }

            // Dummy methods that return the proxy for chaining (satisfies FirestoreAdapter)
            const proxyMethods = ['collection', 'doc', 'where', 'limit', 'orderBy', 'onSnapshot'];
            if (proxyMethods.includes(prop as string)) {
                return () => createProxy(serviceName);
            }

            return (...args: any[]) => {
                throw new Error(`Firebase ${serviceName} is not initialized. Check your credentials.`);
            };
        }
    });
}

export const adminDb = createProxy('firestore');
export const adminAuth = createProxy('auth');
export const adminStorage = createProxy('storage');

export default app;
