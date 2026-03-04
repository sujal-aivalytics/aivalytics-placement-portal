const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !rawKey) {
    console.error('Missing ENV variables');
    process.exit(1);
}

function testKey(key, label) {
    console.log(`\n--- Testing: ${label} ---`);
    try {
        // Clear previous apps
        if (admin.apps.length > 0) {
            admin.apps.forEach(app => app.delete());
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: key,
            })
        });
        console.log(`✅ ${label} worked!`);
        return true;
    } catch (e) {
        console.log(`❌ ${label} failed: ${e.message}`);
        if (e.message.includes('ASN.1')) {
            console.log('   (ASN.1 error usually means line endings or truncation)');
        }
        return false;
    }
}

// Variation 1: As is (with quote stripping and \n conversion)
const v1 = rawKey.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
testKey(v1, 'V1: Basic cleanup');

// Variation 2: Strict PEM reconstruction (single long line)
const v2_core = v1.replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
const v2 = `-----BEGIN PRIVATE KEY-----\n${v2_core}\n-----END PRIVATE KEY-----\n`;
testKey(v2, 'V2: Reconstructed (single line core)');

// Variation 3: Reconstructed with 64-char wraps
const v3_core = v2_core.match(/.{1,64}/g).join('\n');
const v3 = `-----BEGIN PRIVATE KEY-----\n${v3_core}\n-----END PRIVATE KEY-----\n`;
testKey(v3, 'V3: Reconstructed (64-char wrap)');

// Variation 4: Reconstructed with \r\n (Windows style)
const v4 = v3.replace(/\n/g, '\r\n');
testKey(v4, 'V4: Reconstructed (64-char wrap + CRLF)');
