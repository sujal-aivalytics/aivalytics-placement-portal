import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { score, total, percentage, testTitle, subtopics } = body;

    const subtopicData = subtopics
      ? subtopics.map((s: any) =>
        `- ${s.name}: ${s.progress?.score}/${s.progress?.total} (${s.progress?.percentage}%)`
      ).join("\n")
      : "No subtopic data available";

    const prompt = `
    You are a kind and friendly teacher helping a student understand their test results.

    Test Name: "${testTitle}"

    Topic-wise Scores:
    ${subtopicData}

    Overall Score: ${score}/${total} (${percentage}%)

    Your task:
    - Find the topic with the HIGHEST score (best topic).
    - Find the topic with the LOWEST score (weakest topic).
    - Explain results in VERY SIMPLE English, like talking to a 12-year-old.
    - Be positive, motivating, and supportive.
    - Explain why the weak topic may feel hard in a simple way.
    - Give ONE very simple and clear tip to improve the weak topic.

    Tone Rules:
    - Use short sentences.
    - Avoid complex or big words.
    - Use phrases like: "Good job", "Nice work", "Try again", "Keep practicing".
    - Sound like a real teacher, not a robot.
    - Output ONLY valid JSON.

    JSON format ONLY:
    {
      "summary": "2 short simple sentences about overall performance.",
      "strengths": "Mention the BEST topic name and praise the student.",
      "improvements": "Mention the WEAKEST topic name and explain why it is hard.",
      "advice": "One clear and easy tip to improve that weak topic."
    }
    `;



    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      // Adding generationConfig to make it more "direct" and less "poetic"
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let feedback;
    try {
      const cleanedText = text.replace(/```json|```/g, "").trim();
      feedback = JSON.parse(cleanedText);
    } catch (err) {
      feedback = {
        summary: "You finished the test. Keep going and improving!",
        strengths: "You did well in some topics. Good effort!",
        improvements: "Some topics were harder. That is okay.",
        advice: "Practice a little every day to get better."
      };

    }

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("AI feedback API error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
