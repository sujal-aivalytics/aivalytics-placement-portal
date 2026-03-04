'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import InterviewInterface from '@/components/interview/interview-interface';

export default function StartInterviewPage() {
  const searchParams = useSearchParams();
  const company = searchParams.get('company');
  const type = searchParams.get('type');

  if (!company || !type) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">Company and type parameters are required to start an interview.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InterviewInterface company={company} type={type} />
    </div>
  );
}
