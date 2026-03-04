import { getGeminiModel } from "./gemini";

export interface GeneratedMCQ {
  question: string;
  options: {
    text: string;
    label: string; // A, B, C, D
  }[];
  correct_answer: string; // The text of the correct answer
  difficulty: "Easy" | "Medium" | "Hard";
  blooms_level: string;
  reference_excerpt?: string; // Short snippet from content proving the answer
}

export interface MCQResponse {
  keyword: string;
  questions: GeneratedMCQ[];
}

export interface MCQRequest {
  content: string;
  keywords?: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
  bloomsLevel?: "Remember" | "Understand" | "Apply" | "Analyze";
  count?: number; // Questions per keyword
}

export async function generateMCQs(request: MCQRequest): Promise<MCQResponse[]> {
  const model = getGeminiModel();
  if (!model) {
    throw new Error("Gemini API key is not configured.");
  }

  const { content, keywords, difficulty = "Medium", bloomsLevel = "Understand", count = 5 } = request;

  const prompt = `
You are an AI engine inside the AIVALYTICS platform.
Your task is to generate high-quality, syllabus-aligned Multiple Choice Questions (MCQs) based on the provided content.

**Content:**
"""
${content}
"""

**Target Keywords/Concepts:**
${keywords && keywords.length > 0 ? JSON.stringify(keywords) : "AUTO_EXTRACT_FROM_CONTENT"}

**Parameters:**
- Difficulty Level: ${difficulty}
- Bloom's Level: ${bloomsLevel}
- Number of questions per keyword: ${count}

**Instructions:**
1. ${keywords && keywords.length > 0 ? "Use the provided keywords." : "Analyze the content and identify the top 3-5 most important concepts/keywords."}
2. For EACH keyword/concept:
   - Identify the most relevant sections from the content.
   - Generate ${count} MCQs that:
     - Are strictly grounded in the content.
     - Test conceptual understanding.
     - Match the requested difficulty and Bloom's level.
     - Include 1 correct answer and 3 plausible distractors.
3. **IMPORTANT**: Return ONLY valid JSON array. No markdown formatting. No introduction.

**JSON Schema:**
[
  {
    "keyword": "string",
    "questions": [
      {
        "question": "string",
        "options": [
          { "label": "A", "text": "string" },
          { "label": "B", "text": "string" },
          { "label": "C", "text": "string" },
          { "label": "D", "text": "string" }
        ],
        "correct_answer": "string (must match one of the option texts exactly)",
        "difficulty": "${difficulty}",
        "blooms_level": "${bloomsLevel}",
        "reference_excerpt": "string (short quote from content)"
      }
    ]
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("--- RAW AI RESPONSE ---");
    console.log(responseText.substring(0, 500) + "..."); // log start
    console.log("------------------------");

    // Clean up markdown code blocks if present
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();

    if (!cleanedText) {
      throw new Error("AI returned an empty response.");
    }

    const data = JSON.parse(cleanedText) as MCQResponse[];
    return data;
  } catch (error: any) {
    console.error("Error generating MCQs:", error);

    // Check if it's a quota/rate limit error
    const errorMessage = error.message || String(error);
    if (errorMessage.includes("429") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("Too Many Requests")) {

      throw new Error(
        "⚠️ AI Quota Exceeded - The Gemini API free tier limit has been reached. " +
        "Please enable MOCK_AI mode in your .env file by adding: MOCK_AI=true " +
        "This will generate sample questions for testing. Alternatively, wait for the quota to reset or upgrade your API plan."
      );
    }

    throw new Error(`Failed to generate MCQs from AI service: ${errorMessage}`);
  }
}
