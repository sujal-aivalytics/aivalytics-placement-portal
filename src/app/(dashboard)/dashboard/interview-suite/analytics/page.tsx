'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BarChart3,
  Clock,
  Target
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function InterviewAnalyticsPage() {
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
          console.error('Failed to fetch interview data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching interview data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Prepare data for charts
  const interviewTypeData = interviews.reduce((acc: Record<string, number>, interview) => {
    const type = interview.interviewType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const verdictData = interviews.reduce((acc: Record<string, number>, interview) => {
    const verdict = interview.overallVerdict;
    acc[verdict] = (acc[verdict] || 0) + 1;
    return acc;
  }, {});

  const scoreData = interviews.map(interview => ({
    name: `${interview.companyType} ${INTERVIEW_CONFIG[interview.interviewType as keyof typeof INTERVIEW_CONFIG]?.title || interview.interviewType}`,
    overall: interview.scores.overallHireability || 0,
    communication: interview.scores.communication || 0,
    technical: interview.scores.technicalKnowledge || 0,
  }));

  const avgScores = {
    technicalKnowledge: interviews.reduce((sum, i) => sum + (i.scores.technicalKnowledge || 0), 0) / interviews.length || 0,
    communication: interviews.reduce((sum, i) => sum + (i.scores.communication || 0), 0) / interviews.length || 0,
    confidence: interviews.reduce((sum, i) => sum + (i.scores.confidence || 0), 0) / interviews.length || 0,
    problemSolving: interviews.reduce((sum, i) => sum + (i.scores.problemSolving || 0), 0) / interviews.length || 0,
    projectUnderstanding: interviews.reduce((sum, i) => sum + (i.scores.projectUnderstanding || 0), 0) / interviews.length || 0,
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
        <h1 className="text-3xl font-bold text-gray-900">Interview Analytics</h1>
        <p className="text-gray-600 mt-2">
          Detailed analysis of your interview performance and trends
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviews.length > 0 
                    ? Math.round(
                        interviews.reduce((sum, i) => {
                          if (i.endedAt) {
                            return sum + (new Date(i.endedAt).getTime() - new Date(i.startedAt).getTime()) / 60000;
                          }
                          return sum;
                        }, 0) / interviews.filter(i => i.endedAt).length
                      )
                    : 0} min
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Interview Type Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Interview Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(interviewTypeData).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${Math.round((percent || 0) * 100)}%`}
                >
                  {Object.entries(interviewTypeData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Verdict Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Interview Verdicts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(verdictData).map(([name, value]) => ({ name, value }))}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Score Comparison */}
      <div className="mb-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Score Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={scoreData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 50,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="overall" name="Overall Score" fill="#8884d8" />
                <Bar dataKey="communication" name="Communication" fill="#82ca9d" />
                <Bar dataKey="technical" name="Technical" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Average Scores by Category */}
      <div>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Average Scores by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(avgScores).map(([category, score]) => (
                <div key={category} className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{score.toFixed(1)}/10</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
