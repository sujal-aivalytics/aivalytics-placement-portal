import * as admin from 'firebase-admin';

export interface UserProfile {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    tenthPercentage?: number;
    twelfthPercentage?: number;
    graduationCGPA?: number;
    backlogs?: number;
    gapYears?: number;
    createdAt?: admin.firestore.Timestamp;
    updatedAt?: admin.firestore.Timestamp;
}

export interface PlacementApplication {
    id: string;
    userId: string;
    company: string;
    status: string;
    currentStage: string;
    candidateId?: string;
    createdAt?: admin.firestore.Timestamp;
    updatedAt?: admin.firestore.Timestamp;
}
