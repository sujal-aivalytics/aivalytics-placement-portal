import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

async function createFirestoreUser() {
  const jsonPath = path.join(process.cwd(), 'firebase-service-account.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Error: firebase-service-account.json not found');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  const app = getApps().length === 0 
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApp();

  const db = getFirestore(app);
  const email = 'user@test.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!userSnapshot.empty) {
      console.log('🔄 User already exists. Updating password...');
      await userSnapshot.docs[0].ref.update({
        password: hashedPassword,
        updatedAt: Timestamp.now()
      });
    } else {
      console.log('➕ Creating new user...');
      const userRef = usersRef.doc();
      await userRef.set({
        id: userRef.id,
        name: 'Test User',
        email,
        password: hashedPassword,
        role: 'user',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }

    console.log('✅ Success!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

createFirestoreUser();
