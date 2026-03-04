
import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel() {
    // Load API key at runtime to ensure it's available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY is missing within process.env");
        return null;
    }
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Based on verified list, gemini-2.0-flash is available.
        return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    } catch (error) {
        console.error("Error initializing Gemini client:", error);
        return null;
    }
}

export async function generateFeedback(stats: {
    score: number;
    accuracy: number;
    totalQuestions: number;
    topics: Record<string, { correct: number; total: number }>;
}) {
    const model = getGeminiModel();
    if (!model) {
        return "Great job! Keep practicing to improve your speed and accuracy. Focus on your weak areas.";
    }

    try {
        const prompt = `
      Analyze the following aptitude test performance and provide personalized coaching feedback (max 150 words).
      
      Stats:
      - Score: ${stats.score}%
      - Accuracy: ${stats.accuracy}%
      - Total Questions: ${stats.totalQuestions}
      - Topic Breakdown: ${JSON.stringify(stats.topics)}
      
      Format the response with:
      1. **Strengths**: What they did well.
      2. **Weaknesses**: Areas to improve.
      3. **Action Plan**: Specific steps to take next.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating feedback with Gemini:", error);
        return "Unable to generate AI feedback at this time. Please try again later.";
    }
}
