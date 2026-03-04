"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Save, Flag, Clock, AlertTriangle, ListFilter } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useProctoring } from "@/hooks/use-proctoring";
import { logMonitoringEvent } from "@/app/actions/monitoring";
import { toast } from "sonner";
import { tcsQuestions, TCSQuestion } from "@/lib/tcs-questions";

export default function AptitudeTestPage() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [markedForReview, setMarkedForReview] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(120 * 60); // 2 hours in seconds

    // Load Questions (In a real app, maybe shuffle here)
    const questions = tcsQuestions;
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Timer Logic
    useEffect(() => {
        const startTimeStr = localStorage.getItem('tcsTestStartTime');
        if (!startTimeStr) {
            router.replace('/tcs-portal/instructions'); // Redirect if no start time
            return;
        }

        const startTime = parseInt(startTimeStr, 10);
        const duration = 120 * 60 * 1000; // 2 hours in ms
        const endTime = startTime + duration;

        const interval = setInterval(() => {
            const now = Date.now();
            const remain = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeLeft(remain);

            if (remain <= 0) {
                clearInterval(interval);
                toast.error("Time's Up! Submitting Section...");
                router.push('/tcs-portal/test/coding');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const { warnings, isFullScreen, enterFullScreen } = useProctoring({
        preventTabSwitch: true,
        preventContextMenu: true,
        preventCopyPaste: true,
        forceFullScreen: true,
        onViolation: async (type, msg) => {
            toast.error(msg, {
                description: "This violation has been recorded.",
                duration: 4000
            });
            await logMonitoringEvent("TCS", type, msg);
        }
    });

    const handleOptionSelect = (val: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
    };

    const toggleMarkReview = () => {
        setMarkedForReview(prev =>
            prev.includes(currentQuestion.id)
                ? prev.filter(id => id !== currentQuestion.id)
                : [...prev, currentQuestion.id]
        );
    };

    if (!isFullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900/95 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-8 max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Security Access Required</h2>
                        <p className="text-gray-500 mt-2">
                            This assessment requires strict full-screen mode.
                            Exiting full-screen is recorded as a violation.
                        </p>
                    </div>
                    <Button onClick={enterFullScreen} className="w-full bg-[#181C2E] text-white">
                        Enter Secure Mode
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100 select-none">

            {/* Warning Banner */}
            {warnings > 0 && (
                <div className="bg-red-500 text-white px-4 py-1 text-xs text-center font-mono animate-pulse">
                    WARNING: {warnings} Security Violations Recorded. Repeated violations will disqualify you.
                </div>
            )}

            {/* Sub-header for Test Info */}
            <div className="bg-white border-b border-gray-200 px-6 py-2 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-[#181C2E] flex items-center gap-2">
                        <ListFilter className="w-4 h-4 text-gray-500" />
                        Section: {currentQuestion.category}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-mono">
                        Q.{currentQuestionIndex + 1}/{totalQuestions}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[#181C2E] font-mono font-bold text-lg bg-gray-100 px-3 py-1 rounded border border-gray-300">
                    <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* Main Question Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <Card className="min-h-[400px] border-0 shadow-md">
                        <div className="p-6 md:p-8 space-y-8">
                            <div className="space-y-4">
                                <span className="text-gray-500 font-medium">Question {currentQuestionIndex + 1}</span>
                                <p className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed">
                                    {currentQuestion.text}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-3">
                                    {currentQuestion.options.map((opt) => (
                                        <div
                                            key={opt.id}
                                            onClick={() => handleOptionSelect(opt.id)}
                                            className={`flex items-center space-x-3 border rounded-lg p-4 transition-colors cursor-pointer hover:bg-gray-50 ${answers[currentQuestion.id] === opt.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${answers[currentQuestion.id] === opt.id ? 'border-blue-600' : 'border-gray-400'}`}>
                                                {answers[currentQuestion.id] === opt.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                            </div>
                                            <Label className="flex-1 cursor-pointer font-normal text-base pointer-events-none">{opt.text}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-between items-center mt-8">
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="text-gray-600"
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(c => c - 1)}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                className={`${markedForReview.includes(currentQuestion.id) ? 'bg-amber-100 text-amber-700 border-amber-300' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}
                                onClick={toggleMarkReview}
                            >
                                <Flag className={`w-4 h-4 mr-2 ${markedForReview.includes(currentQuestion.id) ? 'fill-current' : ''}`} />
                                {markedForReview.includes(currentQuestion.id) ? 'Marked' : 'Mark for Review'}
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]" onClick={() => {
                                // Save and next logic
                                if (currentQuestionIndex < totalQuestions - 1) {
                                    setCurrentQuestionIndex(c => c + 1);
                                } else {
                                    localStorage.setItem('tcsAptitudeAnswers', JSON.stringify(answers));
                                    toast.success("Section Completed. Proceeding to Coding...");
                                    router.push('/tcs-portal/test/coding');
                                }
                            }}>
                                <Save className="w-4 h-4 mr-2" /> {currentQuestionIndex === totalQuestions - 1 ? 'Finish Section' : 'Save & Next'}
                            </Button>
                        </div>
                        <Button
                            variant="default"
                            className="bg-[#181C2E] hover:bg-gray-800"
                            onClick={() => {
                                if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(c => c + 1);
                            }}
                        >
                            Skip <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Question Palette Sidebar */}
                <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col hidden md:flex">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4">Question Palette</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"></div> Answered</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gray-300"></div> Not Visited</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div> Marked Review</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border border-blue-600"></div> Current</div>
                        </div>
                    </div>

                    <div className="flex-1 p-4">
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => {
                                const isCurrent = currentQuestionIndex === idx;
                                const isAnswered = !!answers[q.id];
                                const isMarked = markedForReview.includes(q.id);

                                let bgClass = "bg-gray-100 text-gray-700 hover:bg-gray-200";
                                if (isMarked) bgClass = "bg-amber-500 text-white hover:bg-amber-600";
                                else if (isAnswered) bgClass = "bg-green-500 text-white hover:bg-green-600";

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestionIndex(idx)}
                                        className={`
                                            h-10 w-10 text-sm font-medium rounded-md flex items-center justify-center transition-all
                                            ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 z-10' : ''}
                                            ${bgClass}
                                        `}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <Button
                            className="w-full bg-[#181C2E] hover:bg-gray-800"
                            onClick={() => router.push('/tcs-portal/test/coding')}
                        >
                            Final Submit Section
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

