/**
 * Placement Question API Client
 * Helper functions for interacting with placement question endpoints
 */

export interface PlacementQuestion {
    id: string;
    text: string;
    type: 'multiple-choice' | 'coding' | 'essay';
    category?: string;
    difficulty?: string;
    metadata?: Record<string, unknown>;
    options: {
        id: string;
        text: string;
    }[];
}

export interface PlacementTest {
    id: string;
    title: string;
    description?: string;
    duration: number;
    company: string;
}

export interface PlacementQuestionsResponse {
    test: PlacementTest;
    questions: PlacementQuestion[];
    stageName: string;
    totalQuestions: number;
}

export interface SubmitStageResponse {
    success: boolean;
    isPassed: boolean;
    nextStage: string | null;
    percentage: number;
    score: number;
    total: number;
    track?: string;
    message?: string;
}

/**
 * Fetch questions for a placement stage
 */
export async function fetchPlacementQuestions(
    applicationId: string,
    stageName: string
): Promise<PlacementQuestionsResponse> {
    const response = await fetch(
        `/api/placements/${applicationId}/stage/${stageName}/questions`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch questions');
    }

    return response.json();
}

/**
 * Submit answers for a placement stage
 */
export async function submitPlacementStage(
    applicationId: string,
    stageName: string,
    data: {
        answers?: Record<string, string>;
        score: number;
        total: number;
        timeSpent: number;
        essayText?: string;
        code?: string;
        language?: string;
    }
): Promise<SubmitStageResponse> {
    const response = await fetch(
        `/api/placements/${applicationId}/stage/${stageName}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit stage');
    }

    return response.json();
}

/**
 * Calculate score for multiple choice questions
 */
export function calculateMCQScore(
    questions: PlacementQuestion[],
    answers: Record<string, string>,
    correctAnswers: Record<string, string>
): { score: number; total: number } {
    let score = 0;
    const total = questions.filter((q) => q.type === 'multiple-choice').length;

    for (const questionId in answers) {
        if (answers[questionId] === correctAnswers[questionId]) {
            score++;
        }
    }

    return { score, total };
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get stage display name
 */
export function getStageDisplayName(stageName: string): string {
    const displayNames: Record<string, string> = {
        foundation: 'Foundation Test',
        advanced: 'Advanced Test',
        coding: 'Coding Assessment',
        aptitude: 'Aptitude Test',
        essay: 'Essay Writing',
        voice: 'Voice Assessment',
        interview: 'Interview',
    };

    return displayNames[stageName.toLowerCase()] || stageName;
}

/**
 * Get stage description
 */
export function getStageDescription(company: string, stageName: string): string {
    const descriptions: Record<string, Record<string, string>> = {
        TCS: {
            foundation: 'Test your Numerical, Verbal, and Reasoning skills',
            advanced: 'Advanced Quantitative and Logical Reasoning',
            coding: 'Solve 3 coding problems to demonstrate your programming skills',
        },
        Wipro: {
            aptitude: 'Test your Quantitative, Logical, and Verbal abilities',
            essay: 'Write an essay on the given topic',
            coding: 'Solve 2 coding problems',
            voice: 'Voice-based communication assessment',
        },
    };

    return descriptions[company]?.[stageName.toLowerCase()] || '';
}

/**
 * Get passing criteria for a stage
 */
export function getPassingCriteria(company: string, stageName: string): string {
    const criteria: Record<string, Record<string, string>> = {
        TCS: {
            foundation: '60% or higher',
            advanced: '65% or higher',
            coding: 'At least 2 out of 3 problems',
        },
        Wipro: {
            aptitude: '65% or higher',
            essay: '70% or higher',
            coding: 'At least 1 out of 2 problems',
        },
    };

    return criteria[company]?.[stageName.toLowerCase()] || 'Pass the assessment';
}

/**
 * Get question count for a stage
 */
export function getQuestionCount(company: string, stageName: string): number {
    const counts: Record<string, Record<string, number>> = {
        TCS: {
            foundation: 30,
            advanced: 20,
            coding: 3,
        },
        Wipro: {
            aptitude: 30,
            essay: 1,
            coding: 2,
        },
    };

    return counts[company]?.[stageName.toLowerCase()] || 0;
}

/**
 * Get duration for a stage (in minutes)
 */
export function getStageDuration(company: string, stageName: string): number {
    const durations: Record<string, Record<string, number>> = {
        TCS: {
            foundation: 60,
            advanced: 45,
            coding: 90,
        },
        Wipro: {
            aptitude: 60,
            essay: 30,
            coding: 60,
            voice: 15,
        },
    };

    return durations[company]?.[stageName.toLowerCase()] || 60;
}

/**
 * Validate answers before submission
 */
export function validateAnswers(
    questions: PlacementQuestion[],
    answers: Record<string, string>
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if all questions are answered
    const mcqQuestions = questions.filter((q) => q.type === 'multiple-choice');
    const unansweredCount = mcqQuestions.filter((q) => !answers[q.id]).length;

    if (unansweredCount > 0) {
        errors.push(`${unansweredCount} question(s) not answered`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: string): string {
    const displayNames: Record<string, string> = {
        numerical: 'Numerical Ability',
        verbal: 'Verbal Ability',
        reasoning: 'Reasoning',
        logical: 'Logical Reasoning',
        quant: 'Quantitative Aptitude',
        coding: 'Coding',
        essay: 'Essay Writing',
    };

    return displayNames[category.toLowerCase()] || category;
}

/**
 * Group questions by category
 */
export function groupQuestionsByCategory(
    questions: PlacementQuestion[]
): Record<string, PlacementQuestion[]> {
    return questions.reduce((acc, question) => {
        const category = question.category || 'other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(question);
        return acc;
    }, {} as Record<string, PlacementQuestion[]>);
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(
    answeredCount: number,
    totalCount: number
): number {
    if (totalCount === 0) return 0;
    return Math.round((answeredCount / totalCount) * 100);
}

/**
 * Check if time is running low (less than 5 minutes)
 */
export function isTimeLow(secondsRemaining: number): boolean {
    return secondsRemaining > 0 && secondsRemaining <= 300; // 5 minutes
}

/**
 * Check if time is critical (less than 1 minute)
 */
export function isTimeCritical(secondsRemaining: number): boolean {
    return secondsRemaining > 0 && secondsRemaining <= 60; // 1 minute
}

/**
 * Auto-save answers to localStorage
 */
export function saveAnswersToLocalStorage(
    applicationId: string,
    stageName: string,
    answers: Record<string, string>
): void {
    const key = `placement_${applicationId}_${stageName}_answers`;
    localStorage.setItem(key, JSON.stringify(answers));
}

/**
 * Load answers from localStorage
 */
export function loadAnswersFromLocalStorage(
    applicationId: string,
    stageName: string
): Record<string, string> | null {
    const key = `placement_${applicationId}_${stageName}_answers`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
}

/**
 * Clear saved answers from localStorage
 */
export function clearSavedAnswers(
    applicationId: string,
    stageName: string
): void {
    const key = `placement_${applicationId}_${stageName}_answers`;
    localStorage.removeItem(key);
}

/**
 * Get track display name
 */
export function getTrackDisplayName(track: string): string {
    const displayNames: Record<string, string> = {
        Digital: 'TCS Digital',
        Ninja: 'TCS Ninja',
        Turbo: 'Wipro Turbo',
        Elite: 'Wipro Elite',
    };

    return displayNames[track] || track;
}

/**
 * Get track color for UI
 */
export function getTrackColor(track: string): string {
    const colors: Record<string, string> = {
        Digital: 'bg-purple-500',
        Ninja: 'bg-blue-500',
        Turbo: 'bg-green-500',
        Elite: 'bg-orange-500',
    };

    return colors[track] || 'bg-gray-500';
}
