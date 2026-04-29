import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

async function testFirebase() {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync('./firebase-service-account.json', 'utf8'));
    initializeApp({
      credential: cert(serviceAccount)
    });
    const db = getFirestore();
    console.log('⏳ Attempting to list collections...');
    const collections = await db.listCollections();
    console.log('✅ Successfully connected! Collections found:', collections.length);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error);
  }
}

testFirebase();
