import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface AssessmentEvaluation {
    scores: {
        logicAndReasoning: number;
        problemSolving: number;
        conceptualDepth: number;
        programmingFundamentals: number;
        algorithmDesign: number;
        debuggingAbility: number;
        systemArchitecture: number;
        attentionToDetail: number;
    };
    feedback: string;
    strengths: string[];
    weaknesses: string[];
    overallVerdict: "Hire" | "Maybe" | "Reject";
}

export async function generateMCQEvaluation(
    score: number,
    totalQuestions: number,
    categoryResults: Record<string, { correct: number; total: number }>,
    roundTitle: string
): Promise<AssessmentEvaluation> {
    if (!GEMINI_API_KEY) {
        return getFallbackMCQReport(score, totalQuestions, roundTitle);
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        const prompt = `
      Evaluate the following MCQ assessment performance for the round: "${roundTitle}".
      
      Performance Summary:
      - Overall Score: ${score}% (${score / 100 * totalQuestions}/${totalQuestions} questions correct)
      - Category Performance: ${JSON.stringify(categoryResults)}
      
      Analyze the candidate's understanding and logic based on the questions they attempted and their accuracy.
      Provide a professional performance report in the following JSON format:
      {
        "scores": {
          "logicAndReasoning": number (1-10),
          "problemSolving": number (1-10),
          "conceptualDepth": number (1-10),
          "programmingFundamentals": number (1-10),
          "algorithmDesign": number (1-10),
          "debuggingAbility": number (1-10),
          "systemArchitecture": number (1-10),
          "attentionToDetail": number (1-10)
        },
        "feedback": "A summary of their conceptual understanding and logical consistency.",
        "strengths": ["list of concepts they seem to master"],
        "weaknesses": ["list of concepts needing improvement"],
        "overallVerdict": "Hire" | "Maybe" | "Reject"
      }
      
      Output ONLY valid JSON. No markdown blocks.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);

        // Ensure all keys exist
        const defaultScores = {
            logicAndReasoning: 5, problemSolving: 5, conceptualDepth: 5,
            programmingFundamentals: 5, algorithmDesign: 5, debuggingAbility: 5,
            systemArchitecture: 5, attentionToDetail: 5
        };
        parsed.scores = { ...defaultScores, ...parsed.scores };
        return parsed;
    } catch (error) {
        console.error("Gemini MCQ Eval Error:", error);
        return getFallbackMCQReport(score, totalQuestions, roundTitle);
    }
}

export async function generateCodingEvaluation(
    score: number,
    code: string,
    language: string,
    passedCases: number,
    totalCases: number,
    problemTitle: string,
    problemDescription: string
): Promise<AssessmentEvaluation> {
    if (!GEMINI_API_KEY) {
        return getFallbackCodingReport(score, passedCases, totalCases);
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        const prompt = `
      Review the following coding assessment performance for the problem: "${problemTitle}".
      
      Problem Statement: ${problemDescription}
      
      Candidate's Work:
      - Language: ${language}
      - Code: \`\`\`${language}\n${code}\n\`\`\`
      - Test Results: ${passedCases}/${totalCases} test cases passed (${score}% score).
      
      Evaluation criteria: Logic accuracy, problem-solving approach, algorithmic efficiency (Big-O), code cleanliness, and attention to edge cases.
      
      Provide a detailed report in the following JSON format:
      {
        "scores": {
          "logicAndReasoning": number (1-10),
          "problemSolving": number (1-10),
          "conceptualDepth": number (1-10),
          "programmingFundamentals": number (1-10),
          "algorithmDesign": number (1-10),
          "debuggingAbility": number (1-10),
          "systemArchitecture": number (1-10),
          "attentionToDetail": number (1-10)
        },
        "feedback": "Strategic feedback on their coding logic, algorithmic choices, and technical depth.",
        "strengths": ["list of specific coding strengths"],
        "weaknesses": ["list of areas for improvement (e.g., big-O, naming, logic flow etc)"],
        "overallVerdict": "Hire" | "Maybe" | "Reject"
      }
      
      Output ONLY valid JSON. No markdown blocks.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);

        // Ensure all keys exist
        const defaultScores = {
            logicAndReasoning: 5, problemSolving: 5, conceptualDepth: 5,
            programmingFundamentals: 5, algorithmDesign: 5, debuggingAbility: 5,
            systemArchitecture: 5, attentionToDetail: 5
        };
        parsed.scores = { ...defaultScores, ...parsed.scores };
        return parsed;
    } catch (error) {
        console.error("Gemini Coding Eval Error:", error);
        return getFallbackCodingReport(score, passedCases, totalCases);
    }
}

function getFallbackMCQReport(score: number, total: number, title: string): AssessmentEvaluation {
    const normalized = score / 10;
    const passed = score >= 70;
    return {
        scores: {
            logicAndReasoning: Math.min(10, normalized + 1),
            problemSolving: normalized,
            conceptualDepth: Math.min(10, normalized + 2),
            programmingFundamentals: Math.min(10, normalized + 1),
            algorithmDesign: normalized,
            debuggingAbility: normalized,
            systemArchitecture: Math.max(1, normalized - 1),
            attentionToDetail: normalized
        },
        feedback: `Automated analysis for ${title} based on ${score}% score.`,
        strengths: passed ? ["Conceptual understanding"] : [],
        weaknesses: !passed ? ["Core fundamentals"] : [],
        overallVerdict: passed ? "Hire" : "Maybe"
    };
}

function getFallbackCodingReport(score: number, passed: number, total: number): AssessmentEvaluation {
    const normalized = score / 10;
    const passedVal = passed;
    return {
        scores: {
            logicAndReasoning: normalized,
            problemSolving: normalized,
            conceptualDepth: Math.max(1, normalized - 1),
            programmingFundamentals: normalized,
            algorithmDesign: normalized,
            debuggingAbility: (passedVal / total) * 10,
            systemArchitecture: Math.max(1, normalized - 2),
            attentionToDetail: (passedVal / total) * 10
        },
        feedback: `Code submission results: ${passed}/${total} test cases passed.`,
        strengths: passed === total ? ["Functional implementation"] : ["Basic attempt"],
        weaknesses: passed < total ? ["Logic refinement required"] : [],
        overallVerdict: passed === total ? "Hire" : "Maybe"
    };
}
