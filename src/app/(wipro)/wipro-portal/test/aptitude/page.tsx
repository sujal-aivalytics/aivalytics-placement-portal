"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Timer, ArrowRight, ArrowLeft, Bookmark } from "lucide-react";
import Link from 'next/link';

import { useProctoring } from "@/hooks/use-proctoring";
import { logMonitoringEvent } from "@/app/actions/monitoring";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export default function AptitudeTestPage() {
    const [currentQ, setCurrentQ] = useState(1);
    const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
    const totalQ = 20;

    const { warnings, isFullScreen, enterFullScreen } = useProctoring({
        preventTabSwitch: true,
        preventContextMenu: true,
        preventCopyPaste: true,
        forceFullScreen: true,
        onViolation: async (type, msg) => {
            toast.error(msg, {
                description: "This violation has been recorded by Wipro Proctoring Agent.",
                duration: 4000
            });
            await logMonitoringEvent("Wipro", type, msg);
        }
    });

    // Enforce Full Screen on Mount
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!document.fullscreenElement) {
                // Initial prompt
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const options = [
        { id: "A", text: "Linear Regression" },
        { id: "B", text: "Logistic Regression" },
        { id: "C", text: "K-Means Clustering" },
        { id: "D", text: "Decision Trees" }
    ];

    if (!isFullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Proctoring Active</h2>
                        <p className="text-slate-500 mt-2">
                            Access to the assessment environment is restricted to full-screen mode only.
                        </p>
                    </div>
                    <Button onClick={enterFullScreen} className="w-full h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white">
                        Enter Secure Environment
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex flex-col gap-6 select-none">
            {/* Warning Banner */}
            {warnings > 0 && (
                <div className="rounded-lg bg-red-500 text-white px-4 py-2 text-xs md:text-sm font-bold text-center flex items-center justify-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                    SECURITY ALERT: {warnings} Violations Detected. System is tracking your actions.
                </div>
            )}

            {/* Top Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Section 01</span>
                        <span className="text-lg font-bold text-slate-800">Data Science Fundamentals</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="flex items-center gap-2 text-slate-600 font-mono text-lg">
                        <Timer className="w-5 h-5 text-purple-600" />
                        <span>28:45</span>
                    </div>
                </div>

                <div className="w-48 flex flex-col items-end gap-1">
                    <span className="text-xs font-medium text-slate-500">Progress: {currentQ} of {totalQ}</span>
                    <Progress value={(currentQ / totalQ) * 100} className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500" />
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Question Card */}
                <div className="lg:col-span-8 flex flex-col">
                    <Card className="flex-1 border-0 shadow-xl shadow-slate-200/40 rounded-[2rem] overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500" />
                        <div className="p-8 md:p-12 flex flex-col h-full">
                            <div className="mb-8">
                                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold mb-4">Question {currentQ}</span>
                                <h2 className="text-2xl font-medium text-slate-900 leading-relaxed">
                                    Which of the following algorithms is primarily used for classification problems when the dependent variable is categorical?
                                </h2>
                            </div>

                            <div className="space-y-4 flex-1">
                                {options.map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => setSelectedOpt(opt.id)}
                                        className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedOpt === opt.id ? 'border-purple-600 bg-purple-50/50' : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${selectedOpt === opt.id ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-500 group-hover:border-purple-300'}`}>
                                                {opt.id}
                                            </div>
                                            <span className={`text-lg transition-colors ${selectedOpt === opt.id ? 'text-purple-900 font-medium' : 'text-slate-600'}`}>{opt.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-12 mt-auto">
                                <Button variant="ghost" className="text-slate-400 hover:text-slate-600" disabled={currentQ === 1} onClick={() => setCurrentQ(c => c - 1)}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                                </Button>
                                <Button className="rounded-full px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 text-lg" onClick={() => setCurrentQ(c => Math.min(c + 1, totalQ))}>
                                    Save & Continue <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Side Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-0 shadow-sm rounded-3xl bg-white/50 backdrop-blur">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-700">Question Navigator</h3>
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-purple-600"><Bookmark className="w-3 h-3 mr-1" /> Bookmarked </Button>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {Array.from({ length: totalQ }, (_, i) => i + 1).map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setCurrentQ(n)}
                                        className={`aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${currentQ === n ? 'bg-slate-900 text-white shadow-md scale-110' : n < currentQ ? 'bg-green-100 text-green-700' : 'bg-white text-slate-400 border border-slate-100 hover:border-purple-200'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-0 bg-blue-50 text-blue-900 rounded-3xl overflow-hidden">
                        <div className="p-6 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <h4 className="font-bold relative z-10">Coding Challenge</h4>
                            <p className="text-sm text-blue-700/80 mt-1 mb-4 relative z-10">Section 2 unlocks automatically after submitting Aptitude.</p>
                            {currentQ === totalQ && (
                                <Link href="/wipro-portal/test/coding" className="relative z-10">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-600/20">Go to Coding Section</Button>
                                </Link>
                            )}
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    );
}
