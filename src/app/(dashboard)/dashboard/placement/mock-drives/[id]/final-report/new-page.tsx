"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Download,
  Share2,
  Award,
  TrendingUp,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface RoundResult {
  id: string;
  roundId: string;
  roundTitle: string;
  roundType: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS";
  completedAt?: string;
  aiFeedback?: string;
}

interface DriveResult {
  id: string;
  driveId: string;
  driveTitle: string;
  companyName: string;
  overallScore: number;
  status: "PASSED" | "FAILED" | "IN_PROGRESS";
  completedAt?: string;
  rounds: RoundResult[];
}

export default function MockFinalReportPage() {
  const params = useParams();
  const router = useRouter();
  const driveId = params.id as string;
  
  const [result, setResult] = useState<DriveResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [driveId]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/mock-drives/${driveId}/final-report`);
      if (res.status === 404) {
        // Not enrolled or no report available
        router.push(`/dashboard/placement/mock-drives/${driveId}`);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch report");
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not load your report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-600 font-medium">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Report Not Available</h2>
            <p className="text-slate-600 mb-6">{error || "You haven't completed this drive yet."}</p>
            <Link href={`/dashboard/placement/mock-drives/${driveId}`}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Drive
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPassed = result.status === "PASSED";
  const totalRounds = result.rounds.length;
  const completedRounds = result.rounds.filter(r => r.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard/placement/mock-drives">
            <Button variant="ghost" className="mb-4 -ml-4 text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mock Drives
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Final Placement Report</h1>
              <p className="text-slate-600 mt-1">{result.companyName} - {result.driveTitle}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Overall Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`mb-6 border-l-4 ${isPassed ? "border-l-emerald-500" : "border-l-red-500"}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isPassed ? "bg-emerald-100" : "bg-red-100"}`}>
                  {isPassed ? (
                    <Trophy className="w-12 h-12 text-emerald-600" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-600" />
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <Badge className={`mb-2 ${isPassed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {isPassed ? "PASSED" : "FAILED"}
                  </Badge>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {isPassed ? "Congratulations!" : "Better Luck Next Time"}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {isPassed 
                      ? "You have successfully completed all rounds of this placement drive." 
                      : "You didn't meet the requirements this time. Keep practicing!"}
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900">{result.overallScore.toFixed(1)}%</div>
                  <div className="text-sm text-slate-500">Overall Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Rounds Completed</p>
                <p className="text-xl font-bold text-slate-900">{completedRounds}/{totalRounds}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Best Round</p>
                <p className="text-xl font-bold text-slate-900">
                  {Math.max(...result.rounds.map(r => r.score)).toFixed(0)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed On</p>
                <p className="text-xl font-bold text-slate-900">
                  {result.completedAt 
                    ? new Date(result.completedAt).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Round Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">Round Performance</h3>
          <div className="space-y-4">
            {result.rounds.map((round, index) => (
              <Card key={round.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        round.status === "COMPLETED" ? "bg-emerald-100" : 
                        round.status === "FAILED" ? "bg-red-100" : "bg-slate-100"
                      }`}>
                        {round.status === "COMPLETED" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : round.status === "FAILED" ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Round {index + 1}: {round.roundTitle}</p>
                        <p className="text-sm text-slate-500 capitalize">{round.roundType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Score</p>
                        <p className={`font-bold ${
                          round.score >= 60 ? "text-emerald-600" : "text-red-600"
                        }`}>{round.score.toFixed(1)}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Questions</p>
                        <p className="font-semibold text-slate-900">{round.answeredQuestions}/{round.totalQuestions}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 pb-4">
                    <Progress 
                      value={round.score} 
                      className="h-2"
                    />
                    {round.aiFeedback && (
                      <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <TrendingUp className="w-4 h-4 inline mr-2" />
                        {round.aiFeedback}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/dashboard/placement/mock-drives">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Drives
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
