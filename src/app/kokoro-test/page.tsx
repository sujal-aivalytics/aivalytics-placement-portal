'use client';

import InterviewInterface from '@/components/interview/interview-interface';
import { COMPANY_TYPES, INTERVIEW_TYPES } from '@/lib/interview-constants';

export default function KokoroTestPage() {
  return (
    <InterviewInterface
      company={COMPANY_TYPES.TCS}
      type={INTERVIEW_TYPES.TECHNICAL}
    />
  );
}
