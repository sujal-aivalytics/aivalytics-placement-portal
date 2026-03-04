export const INTERVIEW_TYPES = {
  TECHNICAL: 'technical',
  MANAGERIAL: 'managerial',
  HR: 'hr',
  BUSINESS_DISCUSSION: 'business_discussion',
} as const;

export type InterviewType = keyof typeof INTERVIEW_TYPES;

export const COMPANY_TYPES = {
  TCS: 'TCS',
  WIPRO: 'Wipro',
} as const;

export type CompanyType = keyof typeof COMPANY_TYPES;

export const INTERVIEW_CATEGORIES = {
  [COMPANY_TYPES.TCS]: [
    { type: INTERVIEW_TYPES.TECHNICAL, label: 'Technical Interview' },
    { type: INTERVIEW_TYPES.MANAGERIAL, label: 'Managerial Interview' },
    { type: INTERVIEW_TYPES.HR, label: 'HR Interview' },
  ],
  [COMPANY_TYPES.WIPRO]: [
    { type: INTERVIEW_TYPES.BUSINESS_DISCUSSION, label: 'Business Discussion' },
  ],
} as const;

export const INTERVIEW_CONFIG = {
  [INTERVIEW_TYPES.TECHNICAL]: {
    title: 'Technical Interview',
    duration: 30, // minutes
    questionsCount: 5,
    description: 'Assess technical skills, programming concepts, and problem-solving abilities.',
    theme: {
      primary: '#0067b1', // TCS blue
      secondary: '#004d80',
    },
  },
  [INTERVIEW_TYPES.MANAGERIAL]: {
    title: 'Managerial Interview',
    duration: 25,
    questionsCount: 5,
    description: 'Evaluate leadership skills, team management, and decision-making abilities.',
    theme: {
      primary: '#0067b1', // TCS blue
      secondary: '#004d80',
    },
  },
  [INTERVIEW_TYPES.HR]: {
    title: 'HR Interview',
    duration: 20,
    questionsCount: 5,
    description: 'Assess communication skills, personality fit, and motivation.',
    theme: {
      primary: '#0067b1', // TCS blue
      secondary: '#004d80',
    },
  },
  [INTERVIEW_TYPES.BUSINESS_DISCUSSION]: {
    title: 'Business Discussion',
    duration: 35,
    questionsCount: 5,
    description: 'Combined technical and HR assessment focusing on business understanding.',
    theme: {
      primary: '#E63312', // Wipro red
      secondary: '#005197', // Wipro blue
    },
  },
} as const;

export const EVALUATION_CRITERIA = {
  TECHNICAL_KNOWLEDGE: 'technicalKnowledge',
  COMMUNICATION_SKILLS: 'communication',
  CONFIDENCE: 'confidence',
  PROBLEM_SOLVING: 'problemSolving',
  PROJECT_UNDERSTANDING: 'projectUnderstanding',
  OVERALL_HIREABILITY: 'overallHireability',
} as const;

export type EvaluationCriteria = keyof typeof EVALUATION_CRITERIA;
