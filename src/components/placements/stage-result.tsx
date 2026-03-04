'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, XCircle, TrendingUp, Clock, 
  Award, ArrowRight, ArrowLeft, Trophy, 
  BrainCircuit, Sparkles, ChevronRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

interface StageResultProps {
  stageName: string;
  isPassed: boolean;
  score: number;
  total: number;
  percentage: number;
  nextStage?: string;
  track?: string;
  applicationId: string;
  feedback?: string;
  timeSpent?: number;
}

export function StageResult({
  stageName,
  isPassed,
  score,
  total,
  percentage,
  nextStage,
  track,
  applicationId,
  feedback,
  timeSpent,
}: StageResultProps) {
  const router = useRouter();

  const getStageTitle = (stage: string) => {
    const titles: Record<string, string> = {
      foundation: 'Foundation Test',
      advanced: 'Advanced Quant + Logical',
      coding: 'Coding Assessment',
      aptitude: 'Aptitude Test',
      essay: 'Essay Writing',
      voice: 'Voice Assessment',
      interview: 'Technical Interview',
    };
    return titles[stage] || stage;
  };

  const getNextStageRoute = (stage: string) => {
    return `/dashboard/placements/${applicationId}/${stage}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const statusLabel = isPassed ? 'Stage Passed' : 'Growing';

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-20">
      {/* Dynamic Header Background */}
      <div className="h-64 w-full bg-slate-900 absolute top-0 left-0 z-0 rounded-b-[3rem]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 pt-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.push(`/dashboard/placements/${applicationId}`)} 
            className="flex items-center text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Application Overview</span>
          </button>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
        </nav>

        {/* Hero Section */}
        <section className="text-white mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-5xl font-black tracking-tight"
          >
            {getStageTitle(stageName)}
          </motion.h1>
          <p className="text-slate-400 mt-2 text-lg font-medium italic opacity-80">
            {isPassed ? "Assessment successfully cleared" : "Assessment performance report"}
          </p>
        </section>

        {/* Main Score Card */}
        <div className="grid gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-0 shadow-2xl shadow-indigo-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <div className="p-10 flex flex-col md:flex-row items-center gap-10">
                {/* Circular Progress */}
                <div className="relative flex items-center justify-center w-40 h-40">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                    <motion.circle
                      cx="80" cy="80" r="70" fill="transparent" stroke="url(#scoreGradient)" strokeWidth="12" strokeLinecap="round"
                      initial={{ strokeDasharray: "0 1000" }} 
                      animate={{ strokeDasharray: `${(percentage / 100) * 440} 1000` }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#9333EA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900">{Math.round(percentage)}%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
                  </div>
                </div>

                {/* Score stats */}
                <div className="flex-1 grid grid-cols-2 gap-8 w-full border-l border-slate-100 pl-0 md:pl-10">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Score</p>
                    <p className="text-2xl font-black text-slate-800">{score} <span className="text-slate-300 font-medium">/ {total}</span></p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Time Spent</p>
                    <p className="text-2xl font-black text-slate-800">{timeSpent ? formatTime(timeSpent) : "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <Badge className={`border-none px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                      isPassed ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      Status: {statusLabel}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-slate-50 p-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-black uppercase tracking-tighter text-slate-700">Assessment Analysis</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <p className="text-sm text-slate-600 leading-relaxed italic md:col-span-2">
                    {feedback || (isPassed 
                      ? "\"Outstanding work! You've demonstrated a strong grasp of the material and are well-prepared for the next challenge.\"" 
                      : "\"Good attempt! While you didn't meet the passing criteria this time, your efforts are building a foundation for future success.\"")}
                  </p>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 flex items-center gap-1">
                      <Sparkles size={10} /> Next Steps
                    </p>
                    <p className="text-xs text-slate-700 font-medium">
                      {isPassed ? "Continue to the next assessment stage to complete your application." : "Review the topics covered and prepare for your next opportunity."}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-rose-400 uppercase mb-1 flex items-center gap-1">
                      <TrendingUp size={10} /> Career Growth
                    </p>
                    <p className="text-xs text-slate-700 font-medium">
                      Each assessment builds critical skills for your future placement journey.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Special Assignment Card (Track/Award) */}
          {track && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-xl rounded-[2.5rem] bg-slate-900 p-8 text-white relative overflow-hidden group">
                <Award className="absolute -bottom-4 -right-4 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">Exclusive Designation</p>
                  <h3 className="text-3xl font-black mb-1">Assigned to: {track} Track</h3>
                  <p className="text-slate-400 text-sm font-medium italic">Your performance has qualified you for this specialized path.</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Primary Action Buttons */}
          <div className="mt-8">
            {isPassed && nextStage && nextStage !== 'completed' ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => router.push(getNextStageRoute(nextStage))} 
                  className="h-16 px-12 rounded-full bg-slate-900 text-white font-bold hover:scale-105 transition-transform shadow-xl shadow-slate-200 group"
                >
                  Proceed to {getStageTitle(nextStage)}
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  onClick={() => router.push(`/dashboard/placements/${applicationId}`)}
                  variant="outline" 
                  className="h-16 px-12 rounded-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  View Application
                </Button>
              </div>
            ) : isPassed && (nextStage === 'completed' || track) ? (
              <div className="text-center">
                <Button 
                  onClick={() => router.push(`/dashboard/placements/${applicationId}`)}
                  className="h-16 px-12 rounded-full bg-indigo-600 text-white font-bold hover:scale-105 transition-transform shadow-xl shadow-indigo-200"
                >
                  View Final Application Status
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Button 
                  onClick={() => router.push('/dashboard/placements')}
                  variant="outline"
                  className="h-16 px-12 rounded-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Back to Placements
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
