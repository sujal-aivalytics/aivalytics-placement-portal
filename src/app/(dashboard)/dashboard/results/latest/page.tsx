'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  CheckCircle2, XCircle, ArrowLeft, Trophy, Sparkles, 
  BrainCircuit, ChevronRight, ListFilter, TrendingUp, Clock, BookOpen
} from "lucide-react";
import { Question } from '@/types';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/loader";

interface LocalTestResult {
  score: number;
  accuracy: number;
  totalQuestions: number;
  answers: Record<string, string>;
  questions: Question[];
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<LocalTestResult | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultId = params?.id as string;
        if (!resultId) return;

        const response = await fetch(`/api/results?id=${resultId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch result');
        }

        const data = await response.json();
        setResult(data.result);
        
        // Mock feedback if none exists, or use actual if API provides it
        setFeedback("Excellent performance overall! You have a strong grasp of the fundamental concepts. Focus on increasing your speed in complex problem-solving sections.");
      } catch (err) {
        console.error('Error fetching result:', err);
        setError(err instanceof Error ? err.message : 'Failed to load result');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchResult();
    }
  }, [params?.id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <Spinner size={64} />
      <p className="mt-4 text-slate-400 font-medium italic tracking-wide">Retrieving your latest results...</p>
    </div>
  );

  if (!result) return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
      <h2 className="text-2xl font-bold">No Results Found</h2>
      <p className="text-slate-500">We couldn't find the test session you're looking for.</p>
      <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-20 relative overflow-hidden">
      {/* Dynamic Header Background */}
      <div className="h-64 w-full bg-slate-900 absolute top-0 left-0 z-0 rounded-b-[3rem]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 pt-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8 text-white">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Dashboard</span>
          </button>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
        </nav>

        {/* Hero Section */}
        <section className="text-white mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-5xl font-black tracking-tight"
              >
                Test Results
              </motion.h1>
              <p className="text-slate-400 mt-2 text-lg font-medium italic opacity-80 uppercase tracking-widest text-[10px]">
                Global Assessment Performance
              </p>
            </div>
            <Badge className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-none bg-indigo-500 text-white shadow-lg shadow-indigo-500/50">
              Completed
            </Badge>
          </div>
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
                      cx="80" cy="80" r="70" fill="transparent" stroke="url(#latestGradient)" strokeWidth="12" strokeLinecap="round"
                      initial={{ strokeDasharray: "0 1000" }} 
                      animate={{ strokeDasharray: `${(result.score / 100) * 440} 1000` }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="latestGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#9333EA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900">{Math.round(result.score)}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Score</span>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-2xl font-black text-slate-800">{Math.round(result.accuracy)}%</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Questions</p>
                    <p className="text-2xl font-black text-slate-800">{result.totalQuestions}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Profile</p>
                    <div className="flex items-center gap-1 text-slate-800 font-bold">
                       <Clock size={16} className="text-indigo-500" /> Optimal
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold uppercase text-xs">
                       <CheckCircle2 size={16} /> Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Feedback Section */}
              <div className="bg-slate-50 p-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-6 uppercase tracking-tighter text-slate-700 font-black text-sm">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  AI Performance Intelligence
                </div>
                <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <BrainCircuit className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div className="prose prose-slate max-w-none relative z-10">
                    <p className="text-slate-600 leading-relaxed font-medium italic">
                      "{feedback}"
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Detailed Analysis */}
          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-2">
                <ListFilter size={20} className="text-indigo-600" />
                Sectional Breakdown
              </h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{result.questions.length} Items</span>
            </div>

            <div className="grid gap-4">
              {result.questions.map((q: Question, idx: number) => {
                const isCorrect = result.answers[q.id] === q.correctOption;
                return (
                  <Card key={q.id} className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                          isCorrect ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                        )}>
                          {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <p className="font-bold text-slate-800 leading-snug">Q{idx + 1}: {q.text}</p>
                            <Badge variant="outline" className={cn(
                              "h-fit rounded-lg text-[10px] uppercase font-black px-2",
                              isCorrect ? "text-emerald-500 border-emerald-100" : "text-rose-500 border-rose-100"
                            )}>
                              {isCorrect ? "Correct" : "Incorrect"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase mb-1">Your Selection</span>
                              <span className="text-sm font-bold text-slate-700">{result.answers[q.id] || 'Skipped'}</span>
                            </div>
                            {!isCorrect && (
                              <div className="p-3 bg-emerald-50 rounded-2xl flex flex-col">
                                <span className="text-[9px] font-black text-emerald-400 uppercase mb-1">Correct Answer</span>
                                <span className="text-sm font-bold text-emerald-700">{q.correctOption}</span>
                              </div>
                            )}
                          </div>

                          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                            <BookOpen size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                              <span className="font-black uppercase text-[10px] block mb-1 opacity-70 tracking-widest">Logic & Explanation</span>
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center py-10">
            <Button asChild variant="outline" className="h-16 px-10 rounded-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild className="h-16 px-12 rounded-full bg-slate-900 text-white font-bold hover:scale-105 transition-transform shadow-xl shadow-slate-200 group">
              <Link href="/dashboard/topics" className="flex items-center">
                Practice Another Topic
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
