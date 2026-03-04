import Airtable from 'airtable';
import { Question } from '@/types';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('Airtable API Key or Base ID is missing');
}

const base = AIRTABLE_API_KEY && AIRTABLE_BASE_ID
    ? new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)
    : null;

// Table Names
const TABLES = {
    USERS: 'Users',
    QUESTIONS: 'Questions',
    TESTS: 'Tests',
    RESULTS: 'Results',
};

import { FieldSet, Record } from 'airtable';

// Helper to map Airtable record to our types
const mapRecord = (record: Record<FieldSet>) => {
    return {
        id: record.id,
        ...record.fields,
    };
};

export const getQuestions = async (filter?: { topic?: string; company?: string; difficulty?: string; section?: string }) => {
    try {
        let formula = '';
        const conditions = [];

        if (filter?.topic) conditions.push(`{topic} = '${filter.topic}'`);
        if (filter?.company) conditions.push(`{company} = '${filter.company}'`);
        if (filter?.difficulty) conditions.push(`{difficulty} = '${filter.difficulty}'`);
        if (filter?.section) conditions.push(`{section} = '${filter.section}'`);

        if (conditions.length > 0) {
            formula = `AND(${conditions.join(', ')})`;
        }

        if (!base) return [];

        const records = await base(TABLES.QUESTIONS)
            .select({
                filterByFormula: formula || undefined,
                maxRecords: 100, // Limit for now
            })
            .all();

        return records.map((record: any) => ({
            id: record.id,
            text: record.get('question_text'),
            options: JSON.parse((record.get('options') as string) || '[]'),
            correctOption: record.get('correct_option'),
            explanation: record.get('explanation'),
            topic: record.get('topic'),
            difficulty: record.get('difficulty'),
            company: record.get('company_tag'),
            section: record.get('section'),
        })) as Question[];
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
};

export const createQuestion = async (question: Omit<Question, 'id'>) => {
    try {
        if (!base) throw new Error('Airtable not configured');

        const records = await base(TABLES.QUESTIONS).create([
            {
                fields: {
                    question_text: question.text,
                    options: JSON.stringify(question.options),
                    correct_option: question.correctOption,
                    explanation: question.explanation,
                    topic: question.topic,
                    difficulty: question.difficulty,
                    company_tag: question.company,
                    section: question.section,
                },
            },
        ]);
        return mapRecord(records[0]);
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
};

// ... Add more helpers as needed for Tests, Results, Users
