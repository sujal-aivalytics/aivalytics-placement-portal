try {
    console.log('🔄 Importing firebase-admin...');
    const { adminDb } = require('./src/lib/firebase-admin');
    console.log('✅ Import successful.');

    console.log('🔄 Attempting to construction (emulating FirestoreAdapter)...');
    // Emulate what FirestoreAdapter likely does
    const app = adminDb.app;
    console.log('✅ Accessing adminDb.app successful. Value:', JSON.stringify(app));

    console.log('🔄 Attempting to call collection (should fail gracefully)...');
    try {
        adminDb.collection('User');
    } catch (e) {
        console.log('✅ Graceful failure detected:', e.message);
    }
} catch (err) {
    console.error('❌ CRASH DETECTED during import or construction:', err);
    process.exit(1);
}
