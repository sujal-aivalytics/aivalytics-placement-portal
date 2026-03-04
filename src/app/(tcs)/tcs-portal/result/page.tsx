"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, XCircle, Download, Home, UserCheck, 
  RefreshCcw, ArrowLeft, Trophy, BrainCircuit, Sparkles, TrendingUp
} from "lucide-react";
import Link from 'next/link';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { tcsQuestions } from '@/lib/tcs-questions';
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function ResultPage() {
    const router = useRouter();
    const [qualified, setQualified] = useState(false);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [codingVerdict, setCodingVerdict] = useState<string>("Fail");
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [loading, setLoading] = useState(true);

    const avgPercentage = useMemo(() => {
        const aptScores = [scores['Quants'] || 0, scores['Verbal'] || 0, scores['Reasoning'] || 0];
        return Math.round(aptScores.reduce((a, b) => a + b, 0) / 3);
    }, [scores]);

    useEffect(() => {
        // 1. Get data from local storage
        const storedAnswers = localStorage.getItem('tcsAptitudeAnswers');
        const storedVerdict = localStorage.getItem('tcsCodingVerdict');

        const userAnswers: Record<number, string> = storedAnswers ? JSON.parse(storedAnswers) : {};
        const finalVerdict = storedVerdict || "Fail";
        setCodingVerdict(finalVerdict);

        // 2. Calculate category scores
        const categoryStats: Record<string, { total: number; correct: number }> = {
            'Quants': { total: 0, correct: 0 },
            'Verbal': { total: 0, correct: 0 },
            'Reasoning': { total: 0, correct: 0 },
            'Programming': { total: 0, correct: 0 },
        };

        tcsQuestions.forEach((q) => {
            const cat = q.category;
            if (categoryStats[cat]) {
                categoryStats[cat].total++;
                if (userAnswers[q.id] === q.correctAnswer) {
                    categoryStats[cat].correct++;
                }
            }
        });

        // 3. Convert to percentages
        const calculatedScores: Record<string, number> = {};
        let totalPercentage = 0;
        let categoriesCount = 0;

        Object.keys(categoryStats).forEach(key => {
            const { total, correct } = categoryStats[key];
            const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
            calculatedScores[key] = pct;

            // Only count aptitude categories for average, exclude programming logic if mixed
            if (key !== 'Programming') {
                totalPercentage += pct;
                categoriesCount++;
            }
        });

        setScores(calculatedScores);

        // 4. Determine Qualification
        const avgScore = categoriesCount > 0 ? totalPercentage / categoriesCount : 0;
        const isQualified = avgScore >= 40 && finalVerdict === "Pass"; 

        setQualified(isQualified);
        setLoading(false);

        localStorage.removeItem('tcsTestStartTime');
    }, []);

    const handleDownload = () => {
        setGeneratingPdf(true);
        setTimeout(() => {
            setGeneratingPdf(false);
            toast.success("Assessment Report Downloaded Successfully");
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-slate-400 font-medium italic">Compiling your performance metrics...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-20 relative overflow-hidden">
            {/* Dynamic Header Background */}
            <div className="h-64 w-full bg-slate-900 absolute top-0 left-0 z-0 rounded-b-[3rem]" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 pt-12">
                {/* Navigation */}
                <nav className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.push('/tcs-portal')} 
                        className="flex items-center text-slate-300 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Exit to Portal</span>
                    </button>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="text-white mb-10 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="flex-1">
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="text-5xl font-black tracking-tight"
                            >
                                {qualified ? "Assessment Qualified" : "Assessment Completed"}
                            </motion.h1>
                            <p className="text-slate-400 mt-2 text-lg font-medium italic opacity-80">
                                TCS National Qualifier Test • Performance Report
                            </p>
                        </div>
                        <Badge variant="outline" className={`h-fit px-4 py-1 border-white/20 text-white backdrop-blur-md uppercase text-[10px] font-black tracking-widest ${
                            qualified ? 'bg-indigo-500/20' : 'bg-rose-500/20'
                        }`}>
                            {qualified ? "Qualified" : "Not Qualified"}
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
                                            cx="80" cy="80" r="70" fill="transparent" stroke="url(#tcsGradient)" strokeWidth="12" strokeLinecap="round"
                                            initial={{ strokeDasharray: "0 1000" }} 
                                            animate={{ strokeDasharray: `${(avgPercentage / 100) * 440} 1000` }} 
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                        <defs>
                                            <linearGradient id="tcsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#4F46E5" />
                                                <stop offset="100%" stopColor="#9333EA" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-slate-900">{avgPercentage}%</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Score</span>
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Coding Status</p>
                                            <p className={`text-xl font-black ${codingVerdict === 'Pass' ? 'text-indigo-600' : 'text-rose-500'}`}>
                                                {codingVerdict === 'Pass' ? 'PASS' : 'FAIL'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                            <p className={`text-xl font-black ${qualified ? 'text-indigo-600' : 'text-rose-500'}`}>
                                                {qualified ? 'SUCCESS' : 'LOCKED'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">
                                        {qualified 
                                            ? "Excellent! You've met the qualification benchmarks for the next selection phase." 
                                            : "You're getting closer. Focus on the low-scoring modules and retake the assessment to qualify."}
                                    </p>
                                </div>
                            </div>

                            {/* Section breakdown */}
                            <div className="bg-slate-50 p-8 border-t border-slate-100">
                                <div className="flex items-center gap-2 mb-6 uppercase tracking-tighter text-slate-700 font-black text-sm">
                                    <BrainCircuit className="w-5 h-5 text-indigo-600" />
                                    Sectional Performance Analysis
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Quants', 'Verbal', 'Reasoning', 'Programming'].map((cat) => (
                                        <div key={cat} className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col items-center group hover:border-indigo-200 transition-colors">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{cat}</p>
                                            <p className={`text-2xl font-black ${scores[cat] >= 60 ? 'text-indigo-600' : 'text-slate-800'}`}>
                                                {scores[cat]}%
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Pro-Tips & Insights */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-xl rounded-[2.5rem] bg-indigo-600 p-8 text-white relative overflow-hidden group">
                            <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                            <div className="relative z-10">
                                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">Coach's Pro-Tip</p>
                                <h4 className="text-lg font-bold italic leading-relaxed">
                                    {qualified 
                                        ? "\"A score of " + avgPercentage + "% is great. Now focus on your technical speech and project explanation for the interview round.\""
                                        : "\"Focus on Quants and Logical modules. Improving your speed by 15% will significantly increase your overall score.\""}
                                </h4>
                            </div>
                        </Card>
                        <div className="flex flex-col gap-4">
                            <div className="p-6 bg-white rounded-[2rem] shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentile Rank</p>
                                    <p className="text-xl font-black text-slate-800">Top {100 - avgPercentage}%</p>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-[2rem] shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    <UserCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interview Ready</p>
                                    <p className="text-xl font-black text-slate-800">{qualified ? "Yes" : "In Progress"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        {qualified ? (
                             <>
                                <Button 
                                    onClick={handleDownload}
                                    disabled={generatingPdf}
                                    variant="outline"
                                    className="h-16 px-10 rounded-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {generatingPdf ? "Generating..." : "Download PDF"}
                                </Button>
                                <Button asChild className="h-16 px-12 rounded-full bg-slate-900 text-white font-bold hover:scale-105 transition-transform shadow-xl shadow-slate-200">
                                    <Link href="/tcs-portal/interview">Proceed to Interview Round</Link>
                                </Button>
                             </>
                        ) : (
                            <Button asChild className="h-16 px-12 rounded-full bg-indigo-600 text-white font-bold hover:scale-105 transition-transform shadow-xl shadow-indigo-200">
                                <Link href="/tcs-portal">Retry Assessment Phase</Link>
                            </Button>
                        )}
                        <Button asChild variant="ghost" className="h-16 px-8 rounded-full text-slate-400 font-bold hover:text-slate-900">
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
