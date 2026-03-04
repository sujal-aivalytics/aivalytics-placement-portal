import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-config";

export async function POST(req: Request) {
  try {
    const { problemId, userCode, language, languageId } = await req.json();

    const problemDoc = await adminDb.collection("Problem").doc(problemId).get();
    if (!problemDoc.exists) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const problem = problemDoc.data() as any;

    const testCases = typeof problem.testCases === "string"
      ? JSON.parse(problem.testCases)
      : (problem.testCases || []);

    const drivers = typeof problem.driverCode === "string"
      ? JSON.parse(problem.driverCode)
      : (problem.driverCode || {});

    let fullcode = drivers[language];
    if (!fullcode) {
      return NextResponse.json({ error: `Driver code for ${language} not found` }, { status: 400 });
    }

    fullcode = fullcode.replace("{{USER_CODE}}", userCode);

    const formattedStdin = testCases.map((tc: any) => (tc.input || "").trim()).join("\n");

    const submissions = [
      {
        language_id: languageId,
        source_code: Buffer.from(fullcode).toString("base64"),
        stdin: Buffer.from(formattedStdin).toString("base64"),
      },
    ];

    const Judge0_IP = process.env.JUDGE0_SERVER_IP;
    const RapidAPI_Key = process.env.RAPIDAPI_JUDGE0_KEY;
    const RapidAPI_Host = process.env.RAPIDAPI_JUDGE0_HOST;

    let baseUrl = "";
    const headers: any = { "Content-Type": "application/json" };

    if (Judge0_IP) {
      baseUrl = Judge0_IP;
    } else if (RapidAPI_Key && RapidAPI_Host) {
      baseUrl = `https://${RapidAPI_Host}`;
      headers["X-RapidAPI-Key"] = RapidAPI_Key;
      headers["X-RapidAPI-Host"] = RapidAPI_Host;
    } else {
      throw new Error("Judge0 configuration missing. Set JUDGE0_SERVER_IP or RapidAPI keys.");
    }

    const response = await fetch(`${baseUrl}/submissions/batch?base64_encoded=true`, {
      method: "POST",
      headers,
      body: JSON.stringify({ submissions }),
    });

    const initialResult = await response.json();
    if (initialResult.error) throw new Error(initialResult.error);

    const tokens = initialResult.map((s: any) => s.token).join(",");

    // Polling Logic
    async function pollbatch(tokens: string) {
      let attempts = 0;
      const MAX_ATTEMPTS = 20;
      while (attempts < MAX_ATTEMPTS) {
        const poll = await fetch(`${baseUrl}/submissions/batch?tokens=${tokens}&base64_encoded=true`, {
          headers: headers
        });
        const data = await poll.json();
        if (data.submissions) {
          const allDone = data.submissions.every((s: any) => s.status && s.status.id > 2);
          if (allDone) return data.submissions[0];
        }
        attempts++;
        await new Promise((r) => setTimeout(r, 1200));
      }
      throw new Error("Judge0 timeout");
    }

    const finalSubmission = await pollbatch(tokens);

    if (finalSubmission.stdout) {
      const decodedOutput = Buffer.from(finalSubmission.stdout, "base64").toString().trim().replace(/\r/g, "");
      const actualOutputs = decodedOutput.split("\n");

      const results = testCases.map((tc: any, index: number) => {
        const actual = actualOutputs[index]?.trim();
        const expected = tc.output.toString().trim();
        return {
          id: tc.id || index,
          passed: actual === expected,
          actual: actual,
          expected: expected
        };
      });

      return NextResponse.json({
        success: results.every((r: any) => r.passed),
        results: results,
        time: finalSubmission.time,
        memory: finalSubmission.memory,
        status: finalSubmission.status
      });
    }

    return NextResponse.json({
      success: false,
      status: finalSubmission.status,
      compile_output: finalSubmission.compile_output ? Buffer.from(finalSubmission.compile_output, "base64").toString() : null,
      stderr: finalSubmission.stderr ? Buffer.from(finalSubmission.stderr, "base64").toString() : null,
    });

  } catch (error: any) {
    console.error("RUN_CODE_ERROR:", error);
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}
