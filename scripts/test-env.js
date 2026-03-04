const dotenv = require('dotenv');
const fs = require('fs');

// Load .env
const env = dotenv.parse(fs.readFileSync('.env'));
const key = env.FIREBASE_PRIVATE_KEY;

console.log('Key length:', key?.length);
console.log('Starts with header:', key?.startsWith('-----BEGIN PRIVATE KEY-----'));
console.log('Ends with footer:', key?.endsWith('-----END PRIVATE KEY-----'));
console.log('Contains literal \\n:', key?.includes('\\n'));
console.log('Contains actual newline:', key?.includes('\n'));

if (key) {
    const fixedKey = key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
    console.log('Fixed Key length:', fixedKey.length);
    console.log('Fixed Key starts with header:', fixedKey.startsWith('-----BEGIN PRIVATE KEY-----'));
    console.log('Fixed Key ends with footer:', fixedKey.endsWith('-----END PRIVATE KEY-----'));
    console.log('Fixed Key contains actual newline:', fixedKey.includes('\n'));
}
