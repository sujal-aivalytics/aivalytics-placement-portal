import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-config";
import { executeCode } from "@/lib/judge0";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { roundId, questionId, code, language, languageId } = await req.json();

        // 1. Fetch Question
        const questionDoc = await adminDb.collection("mockQuestions").doc(questionId).get();
        if (!questionDoc.exists) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }
        const question = questionDoc.data() as any;

        const metadata = question.codingMetadata ? (typeof question.codingMetadata === 'string' ? JSON.parse(question.codingMetadata) : question.codingMetadata) : {};
        const allTestCases = metadata.testCases || [];
        // Filter out hidden test cases for "Run" (simulation mode)
        const testCases = allTestCases.filter((tc: any) => !tc.isHidden);

        // 2. Prepare Code for Execution
        const drivers = metadata.driverCode || {};
        let fullcode = drivers[language] || code;

        if (drivers[language]) {
            fullcode = fullcode.replace("{{USER_CODE}}", code);
        }

        // 3. Execute all test cases using Judge0
        if (testCases.length === 0) {
            const result = await executeCode(fullcode, languageId, "");
            return NextResponse.json({
                success: result.status.id === 3,
                results: [{
                    id: 0,
                    passed: result.status.id === 3,
                    status: result.status,
                    stdout: result.stdout,
                    stderr: result.stderr,
                    compile_output: result.compile_output || "",
                    time: result.time || "0.1",
                    memory: result.memory || "1024"
                }]
            });
        }

        const judge0Results = await Promise.all(
            testCases.map((tc: any) =>
                executeCode(fullcode, languageId, tc.input?.toString().trim() || "")
            )
        );

        // 4. Format Results
        const formattedResults = judge0Results.map((res: any, index: number) => {
            const stdout = (res.stdout || "").trim();
            const expected = (testCases[index]?.output || "").toString().trim();
            let passed = res.status.id === 3 && stdout === expected;

            return {
                id: testCases[index]?.id || index,
                passed,
                status: passed ? { id: 3, description: "Accepted" } : (res.status.id === 3 ? { id: 4, description: "Wrong Answer" } : res.status),
                stdout,
                stderr: res.stderr,
                compile_output: res.compile_output || "",
                time: res.time,
                memory: res.memory
            };
        });

        return NextResponse.json({
            success: formattedResults.every(r => r.passed),
            results: formattedResults
        });

    } catch (error: any) {
        console.error('Coding Run Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
