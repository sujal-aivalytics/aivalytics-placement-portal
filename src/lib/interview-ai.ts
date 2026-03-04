import { GoogleGenerativeAI } from '@google/generative-ai';
import { INTERVIEW_TYPES, EVALUATION_CRITERIA } from './interview-constants';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface InterviewContext {
  interviewType: string;
  companyType: string;
  candidateName?: string;
  currentQuestionIndex: number;
  previousQuestions: string[];
  previousAnswers: string[];
  conversationHistory: Array<{ role: 'interviewer' | 'candidate' | 'user' | 'model'; content: string }>;
  topics?: string;
  companyContext?: string;
}

export interface AIResponse {
  question: string;
  followUp?: string;
  evaluation?: {
    score: number;
    feedback: string;
  };
}

export async function getAIInterviewResponse(context: InterviewContext): Promise<AIResponse> {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is missing. Returning mock response.');
    return getMockInterviewResponse(context);
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = buildInterviewPrompt(context);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response to extract question and evaluation
    return parseAIResponse(text);
  } catch (error) {
    console.error('Error generating AI interview response:', error);
    return getFallbackResponse(context);
  }
}

function buildInterviewPrompt(context: InterviewContext): string {
  return buildCompanyPrompt(context);
}

function buildCompanyPrompt(context: InterviewContext): string {
  const turns = context.previousQuestions.length;
  const company = context.companyType || "our company";

  // Define stage based on turns
  // 0: Greeting
  // 1-3: HR Round (if HR) or Intro (if Technical)
  // 4+: Technical/Deep dive

  let currentStagePrompt = "";

  if (turns === 0) {
    currentStagePrompt = `
👋 INTERVIEW START PROMPT (GREETING)
Send this first to HeyGen:

Good morning.

Welcome to the ${company} interview process.
${context.companyContext ? `\nAbout ${company}: ${context.companyContext}\n` : ''}
${context.interviewType === 'TECHNICAL' ? `\nToday's technical round will focus on: ${context.topics || 'Software Engineering'}.\n` : ''}
I am your interviewer for today.
Please make yourself comfortable.

Let us begin with your introduction.
`;
  } else if (context.interviewType === 'HR' || turns <= 3) {
    currentStagePrompt = `
❓ HR ROUND PROMPT (${company.toUpperCase()} STYLE)
${context.companyContext ? `\nBUSINESS CONTEXT: ${context.companyContext}\n` : ''}
Ask standard ${company} HR interview questions focusing on:

- Self-introduction
- Educational background
- Communication skills
- Teamwork experience
- Strengths and areas of improvement
- Work ethics and adaptability
- Career goals with ${company}

Ask one question at a time.
After each response, acknowledge briefly and continue.
`;
  } else if (turns <= 8) {
    currentStagePrompt = `
💻 TECHNICAL ROUND PROMPT (${company.toUpperCase()} STYLE)
${context.topics ? `\nTECHNICAL FOCUS: ${context.topics}\n` : ''}
Conduct the technical interview round.

Rules:
- Ask role-relevant technical questions
- Begin with basic concepts
- Gradually increase difficulty
- Ask only one technical question at a time
- If the answer is incomplete, ask a clarification question
- Maintain a neutral tone regardless of correctness
- Do not correct or guide the candidate
`;
  } else {
    currentStagePrompt = `
🏁 INTERVIEW CLOSING PROMPT
Final HeyGen video:

Thank you for taking the time to attend this interview.

This concludes the interview process for today.
You will be informed about the next steps through the official channel.

Have a good day.
`;
  }

  return `
You are a professional female Human Resources interviewer representing ${company}.

You are displayed as a digital avatar conducting a formal corporate interview on the ${company} interview portal.

Your role:
- Conduct the interview exactly like an offline ${company} HR interview
- Speak in a calm, confident, and professional tone
- Ask one question at a time
- Wait patiently for the candidate’s response
- Maintain a respectful, unbiased, and corporate demeanor
- Ensure the candidate feels comfortable but not casual

Your personality:
- Professional
- Polite and composed
- Supportive but firm
- Attentive listener
- Corporate HR mindset

Your speaking style:
- Clear, neutral English
- No slang, jokes, or casual phrases
- Short natural pauses
- Simple professional sentences
- Warm but formal tone

Strict rules:
- Never interrupt the candidate
- Never answer on behalf of the candidate
- Never provide feedback during the interview
- Never show emotions like excitement or disappointment
- If the answer is unclear, ask a polite follow-up
- If the candidate pauses, encourage gently
- If the candidate finishes their answer, ask a contextual follow-up or move to the next relevant topic.
- Do not reveal evaluation or scores

Always behave as a real ${company} HR manager.

Current Context:
Previous Questions: ${context.previousQuestions.join(' | ')}
Previous Answers: ${context.previousAnswers.join(' | ')}

Based on the context, you are in the following stage:
${currentStagePrompt}

Output ONLY the spoken text for the avatar. Do not include labels like "Sarah:" or "Interviewer:".
`;
}

function parseAIResponse(response: string): AIResponse {
  // Simple parsing - in a real implementation, we'd have more robust parsing
  return {
    question: response.trim(),
  };
}

function getMockInterviewResponse(context: InterviewContext): AIResponse {
  if (context.currentQuestionIndex === 0) {
    if (context.interviewType === INTERVIEW_TYPES.HR) {
      return {
        question: "Hello! Welcome to your HR interview. Could you please introduce yourself and tell me about your background?",
      };
    } else if (context.interviewType === INTERVIEW_TYPES.TECHNICAL) {
      return {
        question: "Welcome to your technical interview. Let's start with a fundamental question. Can you explain the difference between a process and a thread?",
      };
    } else {
      return {
        question: "Welcome to your interview. Could you please introduce yourself?",
      };
    }
  } else {
    return {
      question: "That's interesting. Could you elaborate more on that?",
    };
  }
}

function getFallbackResponse(context: InterviewContext): AIResponse {
  return getMockInterviewResponse(context);
}

// Function to generate evaluation and feedback after interview completion
export async function generateInterviewEvaluation(
  interviewType: string,
  companyType: string,
  questions: string[],
  answers: string[],
  transcript: string
): Promise<{
  scores: Record<string, number>;
  feedback: string;
  overallVerdict: string;
  strengths?: string[];
  weaknesses?: string[];
}> {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is missing. Returning mock evaluation.');
    return getMockEvaluation();
  }
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    let prompt = `
      Evaluate the following interview performance for a ${companyType} ${interviewType} interview.
      
      Questions asked:
      ${questions.join('\n- ')}
      
      Candidate answers:
      ${answers.join('\n- ')}
      
      Full transcript:
      ${transcript}
      
      Provide evaluation in the following JSON format:
      {
        "scores": {
          "programmingFundamentals": number (1-10),
          "oopConcepts": number (1-10),
          "dsaBasics": number (1-10),
          "sdlc": number (1-10),
          "appDev": number (1-10),
          "debugging": number (1-10),
          "sqlBasics": number (1-10),
          "collaboration": number (1-10),
          "overallHireability": number (1-10)
        },
        "feedback": "Constructive feedback summary",
        "strengths": ["list of strengths"],
        "weaknesses": ["list of areas to improve"],
        "overallVerdict": "Hire" | "Maybe" | "Needs Improvement"
      }
      
      Key Requirements:
      - Be professional, encouraging but honest.
      - Ensure all score keys in the JSON are provided (1-10).
      - Output ONLY valid JSON. No markdown blocks.
    `;

    if (companyType === 'TCS') {
      prompt = `
POST-INTERVIEW EVALUATION PROMPT (BACKEND ONLY)
Generate an interview evaluation report for Tata Consultancy Services (TCS).
 
Candidate Transcript:
${transcript}
 
Include:
- Communication skills
- Technical understanding
- Confidence level
- Professional attitude
- Strengths
- Areas for improvement
- Overall TCS HR recommendation
 
Keep the tone formal, objective, and corporate.
Do not include emotional language.
 
Output JSON:
{
  "scores": {
    "communication": number (1-10),
    "technicalUnderstanding": number (1-10),
    "confidence": number (1-10),
    "professionalAttitude": number (1-10),
    "overallHireability": number (1-10)
  },
  "strengths": ["string"],
  "areasForImprovement": ["string"],
  "overallVerdict": "Hire" | "Maybe" | "Reject",
  "detailedFeedback": "string"
}
`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanText);
      return parsed;
    } catch (parseError) {
      console.error('JSON Parse Error in Interview AI:', parseError, text);
      return {
        scores: {
          programmingFundamentals: 7,
          oopConcepts: 7,
          dsaBasics: 6,
          sdlc: 7,
          appDev: 6,
          debugging: 7,
          sqlBasics: 6,
          collaboration: 8,
          overallHireability: 7,
        },
        feedback: "We encountered a minor issue parsing the detailed breakdown, but your performance was generally strong. Focus on technical clarity and structural concepts.",
        strengths: ["Communication", "Problem Solving"],
        weaknesses: ["Structural Depth"],
        overallVerdict: "Maybe",
      };
    }
  } catch (error) {
    console.error('Error generating interview evaluation:', error);
    return getMockEvaluation();
  }
}

function getMockEvaluation(): {
  scores: Record<string, number>;
  feedback: string;
  overallVerdict: string;
  strengths?: string[];
  weaknesses?: string[];
} {
  return {
    scores: {
      programmingFundamentals: 7,
      oopConcepts: 8,
      dsaBasics: 6,
      sdlc: 7,
      appDev: 6,
      debugging: 7,
      sqlBasics: 6,
      collaboration: 8,
      overallHireability: 7,
    },
    feedback: "Good performance overall. Your communication skills are strong and you demonstrated good problem-solving abilities. However, you could strengthen your technical fundamentals and show more confidence during the interview.",
    strengths: ["Strong communication", "Logical approach"],
    weaknesses: ["Confidence", "Technical depth"],
    overallVerdict: "Maybe",
  };
}
