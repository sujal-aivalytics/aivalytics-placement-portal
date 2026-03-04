const dotenv = require('dotenv');
const fs = require('fs');

const env = dotenv.parse(fs.readFileSync('.env'));
const key = env.FIREBASE_PRIVATE_KEY;

if (key) {
    const fixedKey = key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
    console.log('Fixed Key Hex (last 50 chars):');
    const buffer = Buffer.from(fixedKey);
    console.log(buffer.slice(-50).toString('hex'));
    console.log('Fixed Key Tail (string):');
    console.log(JSON.stringify(fixedKey.slice(-50)));
}
