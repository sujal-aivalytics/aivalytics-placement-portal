'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Clock, 
  GraduationCap, 
  Users, 
  BarChart3, 
  FileText, 
  Download,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { INTERVIEW_CONFIG } from '@/lib/interview-constants';

interface InterviewSession {
  id: string;
  interviewType: string;
  companyType: string;
  startedAt: string;
  endedAt: string | null;
  scores: {
    technicalKnowledge?: number;
    communication?: number;
    confidence?: number;
    problemSolving?: number;
    projectUnderstanding?: number;
    overallHireability?: number;
  };
  feedback: string;
  overallVerdict: string;
}

export default function InterviewHistoryPage() {
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/interviews');
        
        if (response.ok) {
          const data = await response.json();
          setInterviews(data.interviews);
        } else {
          console.error('Failed to fetch interview history:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching interview history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getVerdictColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'hire':
        return 'bg-green-100 text-green-800';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs improvement':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
        <p className="text-gray-600 mt-2">
          View your past AI interview sessions and performance analytics
        </p>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Interviews</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {interviews.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
              <p className="text-gray-500">Start your first AI interview to see it here</p>
              <Button className="mt-4" onClick={() => window.location.href = '/dashboard/interview-suite'}>
                Start Interview
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company & Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Verdict</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview) => {
                  const config = INTERVIEW_CONFIG[interview.interviewType as keyof typeof INTERVIEW_CONFIG];
                  const overallScore = interview.scores.overallHireability || 0;
                  
                  return (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            interview.companyType === 'TCS' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gradient-to-r from-orange-100 to-red-100 text-red-600'
                          }`}>
                            {interview.companyType === 'TCS' ? (
                              <GraduationCap className="w-5 h-5" />
                            ) : (
                              <Users className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {config?.title || interview.interviewType}
                            </div>
                            <div className="text-sm text-gray-500">{interview.companyType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {format(new Date(interview.startedAt), 'MMM d, yyyy h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {interview.endedAt 
                            ? `${Math.round((new Date(interview.endedAt).getTime() - new Date(interview.startedAt).getTime()) / 1000 / 60)} min` 
                            : 'In Progress'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getScoreColor(overallScore)}`}>
                          {overallScore}/10
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getVerdictColor(interview.overallVerdict)}>
                          {interview.overallVerdict}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviews.length > 0 
                    ? (interviews.reduce((sum, i) => sum + (i.scores.overallHireability || 0), 0) / interviews.length).toFixed(1) 
                    : '0.0'}/10
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviews.length > 0 
                    ? Math.round(
                        (interviews.filter(i => i.overallVerdict === 'Hire').length / interviews.length) * 100
                      ) 
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
