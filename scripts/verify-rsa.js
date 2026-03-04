const crypto = require('crypto');
const dotenv = require('dotenv');
const fs = require('fs');

const env = dotenv.parse(fs.readFileSync('.env'));
let key = env.FIREBASE_PRIVATE_KEY;

if (!key) {
    console.error('❌ No key found in .env');
    process.exit(1);
}

// Emulate our sanitize logic
key = key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();

if (key.includes('PRIVATE KEY')) {
    const header = "-----BEGIN PRIVATE KEY-----";
    const footer = "-----END PRIVATE KEY-----";
    const core = key.split(header)[1].split(footer)[0].replace(/\s+/g, '');
    key = `${header}\n${core}\n${footer}\n`;
}

try {
    // Try to load as a private key using Node's crypto
    const pkey = crypto.createPrivateKey(key);
    console.log('✅ Key is mathematically VALID according to Node crypto.');
    console.log('Key asymmetric type:', pkey.asymmetricKeyType);
} catch (err) {
    console.error('❌ Key is INVALID according to Node crypto:', err.message);
}
