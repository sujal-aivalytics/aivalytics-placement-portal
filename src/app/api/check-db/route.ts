import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-config';

export async function GET() {
    try {
        const results1 = await adminDb.collection("Result").get();
        const results2 = await adminDb.collection("results").get();
        const test1 = await adminDb.collection("Test").get();
        const test2 = await adminDb.collection("tests").get();
        const user1 = await adminDb.collection("User").get();
        const user2 = await adminDb.collection("users").get();
        const opt1 = await adminDb.collection("Option").get();
        const opt2 = await adminDb.collection("options").get();
        const q1 = await adminDb.collection("Question").get();
        const q2 = await adminDb.collection("questions").get();
        
        return NextResponse.json({
            Result: results1.size,
            results: results2.size,
            Test: test1.size,
            tests: test2.size,
            User: user1.size,
            users: user2.size,
            Option: opt1.size,
            options: opt2.size,
            Question: q1.size,
            questions: q2.size,
            MockCompanyDrive: (await adminDb.collection("MockCompanyDrive").get()).size,
            MockRound: (await adminDb.collection("MockRound").get()).size,
            ResultDocs: results1.docs.map(d => ({id: d.id, ...d.data()})),
            TestDocs: test1.docs.map(d => ({id: d.id, ...d.data()})),
            UserDocs: user2.docs.map(d => ({id: d.id, ...d.data()})),
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
