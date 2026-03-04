// Wipro Essay Writing Prompts
// 10 prompts total (1 shown per test)

export interface EssayPrompt {
    id: string;
    title: string;
    prompt: string;
    wordLimit: {
        min: number;
        max: number;
    };
    guidelines: string[];
}

export const wiproEssayPrompts: EssayPrompt[] = [
    {
        id: 'wipro-essay-1',
        title: 'Technology and Society',
        prompt: 'Discuss the impact of artificial intelligence on modern society. Include both positive and negative aspects.',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-2',
        title: 'Environmental Sustainability',
        prompt: 'What role should corporations play in addressing climate change? Discuss with examples.',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-3',
        title: 'Education and Innovation',
        prompt: 'How can the education system be reformed to better prepare students for the future workplace?',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-4',
        title: 'Work-Life Balance',
        prompt: 'Discuss the importance of work-life balance in the modern corporate world and suggest ways to achieve it.',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-5',
        title: 'Digital Transformation',
        prompt: 'How has digital transformation changed the way businesses operate? Provide examples from different industries.',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-6',
        title: 'Leadership Qualities',
        prompt: 'What are the essential qualities of an effective leader in the 21st century?',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-7',
        title: 'Cybersecurity',
        prompt: 'Discuss the growing importance of cybersecurity in our increasingly digital world.',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-8',
        title: 'Remote Work',
        prompt: 'Analyze the advantages and disadvantages of remote work culture that emerged during the pandemic.',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-9',
        title: 'Innovation and Creativity',
        prompt: 'How can organizations foster a culture of innovation and creativity among their employees?',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
    {
        id: 'wipro-essay-10',
        title: 'Ethical Technology',
        prompt: 'Discuss the ethical considerations that technology companies should keep in mind when developing new products.',
        wordLimit: { min: 200, max: 300 },
        guidelines: [
            'Write in clear, grammatically correct English',
            'Organize your thoughts with a clear introduction, body, and conclusion',
            'Provide specific examples to support your arguments',
            'Maintain a formal tone throughout',
        ],
    },
];
