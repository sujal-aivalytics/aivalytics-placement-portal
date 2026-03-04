export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[]; // JSON string of array
  correctOption: string; // The correct option text or index
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company?: string;
  section: 'Quantitative' | 'Logical' | 'Verbal' | 'Other';
}

export interface Test {
  id: string;
  name: string;
  type: 'Topic' | 'Company';
  topic?: string;
  company?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  questionIds: string[]; // Array of question IDs
  isActive: boolean;
}

export interface Result {
  id: string;
  userId: string;
  testId: string;
  score: number;
  accuracy: number;
  timeTaken: number; // in seconds
  createdAt: string;
  details?: Record<string, unknown>; // JSON for detailed analysis
}

export interface Topic {
  name: string;
  count: number;
}

export interface Company {
  name: string;
  count: number;
}
