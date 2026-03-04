"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AIQuestionRequest {
    topic: string;
    count: number;
    difficulty: string;
    type: 'multiple-choice' | 'coding';
    companyContext?: string; // Optional: e.g. "TCS", "Wipro"
}

export async function generateQuestions(request: AIQuestionRequest) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return { error: "Gemini API Key not configured" };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

        let prompt = "";

        if (request.type === 'multiple-choice') {
            prompt = `Generate ${request.count} multiple-choice interview questions for the topic "${request.topic}".
            Difficulty: ${request.difficulty}.
            ${request.companyContext ? `Context: These are for a ${request.companyContext} placement exam.` : ""}
            
            Return the response ONLY as a valid JSON array of objects. Do not include markdown formatting or backticks.
            Structure:
            [
                {
                    "text": "Question text here",
                    "options": [
                        { "text": "Option A", "isCorrect": false },
                        { "text": "Option B", "isCorrect": true },
                        { "text": "Option C", "isCorrect": false },
                        { "text": "Option D", "isCorrect": false }
                    ],
                    "category": "${request.topic}",
                    "difficulty": "${request.difficulty}"
                }
            ]`;
        } else {
            prompt = `Generate ${request.count} coding problems for the topic "${request.topic}".
            Difficulty: ${request.difficulty}.
             ${request.companyContext ? `Context: These are for a ${request.companyContext} placement exam.` : ""}

            Return the response ONLY as a valid JSON array of objects. Do not include markdown formatting or backticks.
            Structure:
            [
                {
                    "text": "Problem title here",
                    "metadata": {
                         "functionName": "solve",
                         "inputFormat": "Description of input",
                         "outputFormat": "Description of output",
                         "constraints": "e.g. N < 100",
                         "testCases": [
                            { "input": "sample input", "output": "sample output", "isHidden": false },
                            { "input": "hidden input", "output": "hidden output", "isHidden": true }
                         ]
                    },
                    "type": "coding",
                    "category": "${request.topic}",
                    "difficulty": "${request.difficulty}"
                }
            ]`;
        }

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean markdown if present
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const questions = JSON.parse(cleanText);
        return { success: true, questions };

    } catch (error) {
        console.error("AI Generation Error:", error);
        return { error: "Failed to generate questions. Please try again." };
    }
}
