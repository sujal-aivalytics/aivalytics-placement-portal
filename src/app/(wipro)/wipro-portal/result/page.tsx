"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, ChevronRight, Share2, Download, 
  ArrowLeft, Trophy, Sparkles, BrainCircuit, ListChecks
} from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function WiproResultPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-20 relative overflow-hidden text-left">
            {/* Dynamic Header Background */}
            <div className="h-64 w-full bg-slate-900 absolute top-0 left-0 z-0 rounded-b-[3rem]" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 pt-12">
                {/* Navigation */}
                <nav className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.push('/wipro-portal')} 
                        className="flex items-center text-slate-300 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Exit Portal</span>
                    </button>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <ListChecks className="w-6 h-6 text-indigo-400" />
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="text-white mb-10 text-center md:text-left">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="text-5xl font-black tracking-tight"
                    >
                        Assessment Submitted
                    </motion.h1>
                    <p className="text-slate-400 mt-2 text-lg font-medium italic opacity-80 uppercase tracking-widest text-[10px]">
                        Wipro Digital Intelligence Assessment
                    </p>
                </section>

                <div className="grid gap-6">
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card className="border-0 shadow-2xl shadow-indigo-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                            <div className="p-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="relative flex items-center justify-center w-40 h-40">
                                    <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                                        <CheckCircle2 className="w-20 h-20 text-indigo-600" />
                                    </div>
                                    <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-10 h-10 animate-pulse" />
                                </div>

                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div>
                                        <Badge className="bg-indigo-50 text-indigo-600 border-none px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                            Success Captured
                                        </Badge>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800">
                                        Everything Looks Great!
                                    </h2>
                                    <p className="text-slate-500 font-medium max-w-md">
                                        Thank you for completing the assessment. Your response has been securely transmitted and added to your profile for evaluation.
                                    </p>
                                </div>
                            </div>

                            {/* Reference Info Section */}
                            <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 font-mono text-sm font-bold text-slate-500">
                                        REF: WIP-2026-X92
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Reference Identification</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest gap-2">
                                        <Download size={14} /> Receipt
                                    </Button>
                                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest gap-2">
                                        <Share2 size={14} /> Experience
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Next Steps Insight */}
                    <Card className="border-0 shadow-xl rounded-[2.5rem] bg-slate-900 p-8 text-white relative overflow-hidden group">
                        <BrainCircuit className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10">
                                <Trophy className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-black mb-1">What's Next?</h3>
                                <p className="text-slate-400 text-sm font-medium">Your profile is currently under review. Shortlisted candidates will be notified within 3-5 business days for the next technical round.</p>
                            </div>
                            <Button asChild className="h-14 px-8 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors ml-auto">
                                <Link href="/wipro-portal">
                                    Return to Portal
                                    <ChevronRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
