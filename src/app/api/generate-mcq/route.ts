import { NextRequest, NextResponse } from "next/server";
import { generateMCQs, MCQRequest } from "@/lib/mcq-generator";
import mammoth from "mammoth";
import { extractText } from "unpdf";

export async function POST(req: NextRequest) {
    console.log(">>> [START] POST /api/generate-mcq");

    try {
        let content = "";
        let keywords: string[] = [];
        let difficulty: any = "Medium";
        let bloomsLevel: any = "Understand";
        let count = 5;

        // check content type
        const contentType = req.headers.get("content-type") || "";
        console.log(">>> Content-Type:", contentType);

        if (contentType.includes("multipart/form-data")) {
            console.log(">>> Processing multipart/form-data...");
            const formData = await req.formData();
            const file = formData.get("file") as File | null;
            const text = formData.get("content") as string | null;
            const keywordsStr = formData.get("keywords") as string | null;

            difficulty = formData.get("difficulty") || "Medium";
            bloomsLevel = formData.get("bloomsLevel") || "Understand";
            count = Number(formData.get("count")) || 5;

            console.log(">>> Params:", { difficulty, bloomsLevel, count, hasFile: !!file, hasText: !!text });

            if (keywordsStr) {
                keywords = keywordsStr.split(",").map((k: string) => k.trim()).filter((k: string) => k);
            }

            if (file) {
                console.log(">>> Parsing file:", file.name, file.type);
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                if (file.type === "application/pdf") {
                    console.log(">>> Calling unpdf extractText...");
                    const { text: pdfTextArray } = await extractText(arrayBuffer);
                    // unpdf returns string[] (pages) or string depending on version/content
                    content = Array.isArray(pdfTextArray) ? pdfTextArray.join("\n") : String(pdfTextArray);
                    console.log(">>> PDF parsed, length:", content.length);
                } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    console.log(">>> Calling mammoth...");
                    const result = await mammoth.extractRawText({ buffer });
                    content = result.value;
                    console.log(">>> DOCX parsed, length:", content.length);
                } else {
                    content = buffer.toString("utf-8");
                    console.log(">>> Text/Other parsed, length:", content.length);
                }
            } else if (text) {
                content = text;
            }

        } else {
            console.log(">>> Processing JSON body...");
            const body = await req.json();
            content = body.content;
            keywords = body.keywords || [];
            difficulty = body.difficulty || "Medium";
            bloomsLevel = body.bloomsLevel || "Understand";
            count = body.count || 5;
        }

        console.log(">>> Final check - Content length:", content?.length, "Keywords:", keywords);

        if (!content || content.trim().length === 0) {
            console.warn(">>> Error: Content is empty");
            return NextResponse.json(
                { error: "Content is required (text or file)." },
                { status: 400 }
            );
        }

        // --- MOCK MODE CHECK ---
        if (process.env.MOCK_AI === "true") {
            console.log(">>> MOCK MODE ACTIVE: Returning dummy data to bypass Quota.");
            // Simulate delay
            await new Promise(r => setTimeout(r, 1500));

            const mockData = [{
                keyword: keywords[0] || "Mock Keyword",
                questions: Array(count).fill(0).map((_: any, i: number) => ({
                    question: `[MOCK] This is a generated question #${i + 1} about ${keywords[0] || "the topic"} (AI Quota Bypassed)`,
                    options: [
                        { label: "A", text: "Correct Answer" },
                        { label: "B", text: "Distractor 1" },
                        { label: "C", text: "Distractor 2" },
                        { label: "D", text: "Distractor 3" }
                    ],
                    correct_answer: "Correct Answer",
                    difficulty: difficulty,
                    blooms_level: bloomsLevel,
                    reference_excerpt: "This is a mock reference excerpt to demonstrate the UI."
                }))
            }];
            return NextResponse.json({ data: mockData });
        }
        // -----------------------

        // Generate MCQs
        console.log(">>> Calling generateMCQs...");
        const data = await generateMCQs({
            content,
            keywords,
            difficulty,
            bloomsLevel,
            count
        });
        console.log(">>> MCQs generated successfully, count:", data.length);

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error("!!! API Error generating MCQs:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
