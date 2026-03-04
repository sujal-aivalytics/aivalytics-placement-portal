import { executeCode, mapPistonToStatus } from "@/lib/piston";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { encoded_code, judge0_id } = body;

        // Decode base64 code sent from frontend if it was intended for Judge0
        let sourceCode = encoded_code;
        try {
            // Check if it's base64 (very likely since old code used base64_encoded=true)
            // Buffer.from works in Node.js/Next.js routes
            sourceCode = Buffer.from(encoded_code, 'base64').toString('utf-8');
        } catch (e) {
            console.log("Not base64 or already decoded");
        }

        const result = await executeCode(sourceCode, judge0_id, "");
        const status = mapPistonToStatus(result);

        // Map Piston response to match what the UI expects from Judge0
        const formattedResponse = {
            stdout: Buffer.from(result.run.stdout).toString('base64'),
            stderr: result.run.stderr ? Buffer.from(result.run.stderr).toString('base64') : null,
            compile_output: result.compile?.stderr ? Buffer.from(result.compile.stderr).toString('base64') : null,
            time: "0.1",
            memory: "1024",
            status: status,
        };

        return Response.json(formattedResponse, { status: 200 });

    } catch (error: any) {
        console.error("Code Run Error:", error);
        return Response.json(
            {
                error: "Failed to execute code",
                details: error.message
            },
            { status: 500 }
        );
    }
}
