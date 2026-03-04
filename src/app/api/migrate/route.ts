import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminDb } from '@/lib/firebase-config';
import * as admin from 'firebase-admin';

export const maxDuration = 300; // 5 minutes

export async function GET(req: NextRequest) {
    console.log('🚀 Starting full migration from Prisma to Firebase...');

    const modelsToMigrate = [
        'Account', 'Session', 'User', 'VerificationToken', 'OneTimePassword',
        'Test', 'TestEligibility', 'Subtopic', 'Question', 'Option', 'Result',
        'UserSubtopicProgress', 'TestAssignment', 'MonitoringEvent', 'InterviewSession',
        'VoiceAssessment', 'PlacementApplication', 'EligibilityCheck', 'AssessmentStage',
        'MockDriveSession', 'Problem', 'Submissions', 'MockCompanyDrive', 'MockRound',
        'MockQuestion', 'MockDriveEnrollment', 'MockRoundProgress', 'MockResponse',
        'MockInterviewInteraction'
    ];

    const results: any = {};

    try {
        for (const model of modelsToMigrate) {
            const prismaModel = model.charAt(0).toLowerCase() + model.slice(1);
            console.log(`Migrating ${model}...`);

            // @ts-ignore
            if (!prisma[prismaModel]) {
                console.error(`Model ${prismaModel} not found in Prisma`);
                continue;
            }

            // @ts-ignore
            const records = await prisma[prismaModel].findMany();
            console.log(`Found ${records.length} records for ${model}`);

            // Firestore collections are usually plural or lowercase, let's use the model name as is
            const collectionName = model;

            const batchSize = 400;
            let currentBatch = adminDb.batch();
            let count = 0;

            for (const record of records) {
                const docId = record.id ? String(record.id) : adminDb.collection(collectionName).doc().id;
                const docRef = adminDb.collection(collectionName).doc(docId);

                const cleanedRecord = Object.entries(record).reduce((acc, [key, value]) => {
                    if (value instanceof Date) {
                        acc[key] = admin.firestore.Timestamp.fromDate(value);
                    } else if (value !== null && value !== undefined) {
                        // Handle objects/arrays for Firestore
                        if (typeof value === 'object' && !Array.isArray(value)) {
                            acc[key] = JSON.parse(JSON.stringify(value));
                        } else {
                            acc[key] = value;
                        }
                    }
                    return acc;
                }, {} as any);

                currentBatch.set(docRef, cleanedRecord);
                count++;

                if (count % batchSize === 0) {
                    await currentBatch.commit();
                    currentBatch = adminDb.batch();
                }
            }

            if (count > 0 && count % batchSize !== 0) {
                await currentBatch.commit();
            }

            results[model] = records.length;
        }

        return NextResponse.json({ success: true, migrated: results });
    } catch (error: any) {
        console.error('Migration API failed:', error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
