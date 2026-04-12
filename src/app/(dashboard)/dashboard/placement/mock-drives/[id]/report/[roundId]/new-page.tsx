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
  AlertTriangle,
  Shield,
  Eye,
  MousePointer,
  Maximize2,
  UserX,
  Activity,
  FileText
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Anomaly {
  id: string;
  type: string;
  details: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}

interface ProctoringData {
  totalAnomalies: number;
  anomalies: Anomaly[];
  startTime?: string;
  endTime?: string;
  tabSwitches: number;
  fullscreenExits: number;
  faceDetectionFails: number;
}

interface RoundResult {
  id: string;
  roundId: string;
  roundTitle: string;
  roundType: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS";
  completedAt?: string;
  timeTaken?: number; // in seconds
  aiFeedback?: string;
  proctoring?: ProctoringData;
}

export default function MockRoundReportPage() {
  const params = useParams();
  const router = useRouter();
  const driveId = params.id as string;
  const roundId = params.roundId as string;
  
  const [result, setResult] = useState<RoundResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [driveId, roundId]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/mock-drives/${driveId}/round/${roundId}/report`);
      if (res.status === 404) {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getAnomalyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "tab_switch": return <MousePointer className="w-4 h-4" />;
      case "fullscreen_exit": return <Maximize2 className="w-4 h-4" />;
      case "face_not_detected": return <UserX className="w-4 h-4" />;
      case "multiple_faces": return <Eye className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
      case "low": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
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
            <p className="text-slate-600 mb-6">{error || "You haven't completed this round yet."}</p>
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

  const isPassed = result.status === "COMPLETED" && result.score >= 60;
  const proctoring = result.proctoring || { 
    totalAnomalies: 0, 
    anomalies: [],
    tabSwitches: 0,
    fullscreenExits: 0,
    faceDetectionFails: 0
  };
  const hasAnomalies = proctoring.totalAnomalies > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href={`/dashboard/placement/mock-drives/${driveId}`}>
            <Button variant="ghost" className="mb-4 -ml-4 text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Drive
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Round Report: {result.roundTitle}</h1>
            <p className="text-slate-600 mt-1 capitalize">{result.roundType} Round</p>
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
                    {isPassed ? "Round Completed!" : "Round Failed"}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {isPassed 
                      ? "You have successfully passed this round." 
                      : "You didn't meet the passing criteria for this round."}
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900">{result.score.toFixed(1)}%</div>
                  <div className="text-sm text-slate-500">Score</div>
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
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Correct</p>
                <p className="text-xl font-bold text-slate-900">{result.correctAnswers}/{result.totalQuestions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Accuracy</p>
                <p className="text-xl font-bold text-slate-900">{result.score.toFixed(0)}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Time Taken</p>
                <p className="text-xl font-bold text-slate-900">
                  {result.timeTaken ? formatTime(result.timeTaken) : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${hasAnomalies ? "bg-red-100" : "bg-emerald-100"}`}>
                <Shield className={`w-6 h-6 ${hasAnomalies ? "text-red-600" : "text-emerald-600"}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Anomalies</p>
                <p className={`text-xl font-bold ${hasAnomalies ? "text-red-600" : "text-emerald-600"}`}>
                  {proctoring.totalAnomalies}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Feedback */}
          {result.aiFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    AI Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{result.aiFeedback}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Proctoring Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-red-600" />
                  SECURITY INCIDENT LOGS
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasAnomalies ? (
                  <div className="space-y-3">
                    {proctoring.anomalies.map((anomaly) => (
                      <div 
                        key={anomaly.id} 
                        className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(anomaly.severity)}`}
                      >
                        <div className="mt-0.5">
                          {getAnomalyIcon(anomaly.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold capitalize">{anomaly.type.replace(/_/g, ' ')}</p>
                            <Badge variant="outline" className="text-xs">
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1 opacity-90">{anomaly.details}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {new Date(anomaly.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-slate-500 text-sm uppercase tracking-wider">
                      REGISTRY CLEAN: ZERO ANOMALIES DETECTED
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Proctoring Stats Detail */}
        {hasAnomalies && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500">
                  Proctoring Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{proctoring.tabSwitches}</p>
                    <p className="text-xs text-slate-500 uppercase">Tab Switches</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{proctoring.fullscreenExits}</p>
                    <p className="text-xs text-slate-500 uppercase">Fullscreen Exits</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{proctoring.faceDetectionFails}</p>
                    <p className="text-xs text-slate-500 uppercase">Face Detection Fails</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{proctoring.totalAnomalies}</p>
                    <p className="text-xs text-slate-500 uppercase">Total Anomalies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href={`/dashboard/placement/mock-drives/${driveId}`}>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Drive
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
