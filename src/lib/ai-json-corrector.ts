import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface CodingProblemData {
  title?: string;
  description?: string;
  constraints?: string;
  examples?: string;
  starterTemplate?: string;
  driverCode?: string;
  testCases?: string;
}

export interface CorrectedProblem {
  examples: any[];
  starterTemplate: Record<string, string>;
  driverCode: Record<string, string>;
  testCases: any[];
  corrections: string[];
}

/**
 * Uses AI to automatically correct JSON syntax errors in coding problem fields
 */
export async function autoCorrectProblemJSON(
  problemData: CodingProblemData
): Promise<CorrectedProblem | null> {
  if (!GEMINI_API_KEY) {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a JSON syntax corrector for a coding platform. Fix the following fields that may have JSON syntax errors.

Title: ${problemData.title || "N/A"}
Description: ${problemData.description || "N/A"}
Constraints: ${problemData.constraints || "N/A"}

EXAMPLES FIELD (may contain invalid JSON):
${problemData.examples || "[]"}

STARTER TEMPLATE FIELD (may contain invalid JSON):
${problemData.starterTemplate || "{}"}

DRIVER CODE FIELD (may contain invalid JSON):
${problemData.driverCode || "{}"}

TEST CASES FIELD (may contain invalid JSON):
${problemData.testCases || "[]"}

Instructions:
1. Fix any JSON syntax errors (missing quotes, trailing commas, single quotes instead of double, etc.)
2. Ensure examples is an array of objects with input/output keys
3. Ensure starterTemplate is an object with language keys (cpp, python, java, etc.) mapping to code strings
4. Ensure driverCode is an object with language keys mapping to code strings
5. Ensure testCases is an array of objects with input/output keys
6. If a field is empty or invalid, provide sensible defaults

Return ONLY valid JSON in this exact format:
{
  "examples": [...],
  "starterTemplate": {...},
  "driverCode": {...},
  "testCases": [...],
  "corrections": ["list of what was fixed"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    const corrected = JSON.parse(jsonMatch[0]);
    
    return {
      examples: corrected.examples || [],
      starterTemplate: corrected.starterTemplate || {},
      driverCode: corrected.driverCode || {},
      testCases: corrected.testCases || [],
      corrections: corrected.corrections || []
    };
  } catch (error) {
    console.error("AI JSON correction failed:", error);
    return null;
  }
}

/**
 * Attempts to fix common JSON syntax errors without AI (faster fallback)
 */
export function quickFixJSON(jsonString: string): string {
  if (!jsonString || !jsonString.trim()) {
    return jsonString;
  }

  let fixed = jsonString.trim();

  // Replace single quotes with double quotes (carefully)
  fixed = fixed.replace(/'/g, '"');

  // Remove trailing commas before closing brackets/braces
  fixed = fixed.replace(/,(\s*[}\]])/g, "$1");

  // Add missing quotes around object keys (simple heuristic)
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

  return fixed;
}

/**
 * Safely parse JSON with fallback corrections
 */
export function safeJSONParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    // Try quick fix
    try {
      const fixed = quickFixJSON(jsonString);
      return JSON.parse(fixed) as T;
    } catch (e2) {
      return defaultValue;
    }
  }
}
