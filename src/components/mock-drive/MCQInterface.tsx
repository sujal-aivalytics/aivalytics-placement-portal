'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle, ListFilter, ChevronLeft, ChevronRight, Save, Flag, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useProctoring } from "@/hooks/use-proctoring";
import { WebcamMonitor } from "@/components/proctoring/webcam-monitor";

interface MCQInterfaceProps {
    round: any;
    enrollment: any;
    questions?: any[]; // Allow passing questions or fetch inside
}

export function MCQInterface({ round, enrollment }: MCQInterfaceProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(() => {
        const progress = enrollment?.roundProgress?.find((p: any) => p.roundId === round?.id);
        const durationSeconds = (round?.durationMinutes || 30) * 60;
        if (progress?.startedAt) {
            const start = new Date(progress.startedAt).getTime();
            const now = new Date().getTime();
            const elapsed = Math.floor((now - start) / 1000);
            return Math.max(0, durationSeconds - elapsed);
        }
        return durationSeconds;
    });
    const [submitting, setSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [markedForReview, setMarkedForReview] = useState<string[]>([]);

    // Proctoring
    const { warnings, isFullScreen, enterFullScreen } = useProctoring({
        preventTabSwitch: true,
        preventContextMenu: true,
        preventCopyPaste: true,
        forceFullScreen: true,
        enrollmentId: enrollment.id,
        roundId: round.id,
        disabled: isCompleted,
        onViolation: async (type, msg) => {
            if (isCompleted) return;
            toast.error(msg, { duration: 4000 });
        }
    });

    // Fetch Questions
    useEffect(() => {
        if (!enrollment) return;
        const fetchQuestions = async () => {
            try {
                // Fetch questions for this round
                const res = await fetch(`/api/mock-drives/${enrollment.driveId}/round/${round.id}/questions`);
                if (!res.ok) throw new Error("Failed to load questions");
                const data = await res.json();
                setQuestions(data.questions || []);
            } catch (error) {
                console.error("Error fetching questions:", error);
                toast.error("Failed to load questions.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [round.id, enrollment?.driveId]);

    // Timer & Persistence
    useEffect(() => {
        if (isCompleted) return;

        // Sync with persisted start time if available
        const progress = enrollment?.roundProgress?.find((p: any) => p.roundId === round.id);
        const durationSeconds = (round?.durationMinutes || 30) * 60;

        if (progress?.startedAt) {
            const start = new Date(progress.startedAt).getTime();
            const now = new Date().getTime();
            const elapsed = Math.floor((now - start) / 1000);
            setTimeLeft(Math.max(0, durationSeconds - elapsed));
        } else {
            // Mark as started immediately on first mount
            fetch('/api/mock-drives/session/mcq/autosave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enrollmentId: enrollment.id,
                    roundId: round.id
                })
            }).catch(err => console.error("Failed to mark MCQ round as started", err));
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isCompleted, enrollment, round.id, round.durationMinutes]);

    // Background Autosave for Answers
    useEffect(() => {
        if (isCompleted || Object.keys(answers).length === 0) return;

        const interval = setInterval(async () => {
            try {
                await fetch('/api/mock-drives/session/mcq/autosave', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        enrollmentId: enrollment.id,
                        roundId: round.id,
                        answers
                    })
                });
            } catch (e) {
                console.error("MCQ Autosave failed", e);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [answers, isCompleted, enrollment.id, round.id]);

    const handleOptionSelect = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentQIndex].id]: value
        }));
    };

    const toggleMarkReview = () => {
        const qId = questions[currentQIndex].id;
        setMarkedForReview(prev =>
            prev.includes(qId)
                ? prev.filter(id => id !== qId)
                : [...prev, qId]
        );
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (submitting || isCompleted) return;

        setSubmitting(true);
        try {
            console.log("Submitting test:", {
                enrollmentId: enrollment.id,
                roundId: round.id,
                answersCount: Object.keys(answers).length
            });

            const res = await fetch(`/api/mock-drives/session/mcq/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enrollmentId: enrollment.id,
                    roundId: round.id,
                    answers: answers
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Submit failed:", res.status, errorData);
                throw new Error(errorData.error || errorData.details || `Submission Failed (${res.status})`);
            }

            const result = await res.json();
            console.log("Submit success:", result);

            setIsCompleted(true);
            toast.success("Test Submitted Successfully!");
        } catch (error: any) {
            console.error("Submit error", error);
            toast.error(error.message || "Failed to submit test. Please try again.");
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /> Loading Assessment...</div>;

    if (isCompleted) {
        return (
            <div className="fixed inset-0 bg-white z-[100000] flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-0 shadow-2xl rounded-3xl overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">Awesome!</h2>
                        <p className="text-blue-100 mt-2">Your assessment has been successfully submitted.</p>
                    </div>
                    <CardContent className="p-8 space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-gray-600">We've recorded your responses and they are being evaluated. You will receive an update shortly on your performance.</p>
                        </div>
                        <Button
                            className="w-full bg-[#181C2E] hover:bg-gray-800 h-12 text-lg rounded-xl shadow-lg shadow-gray-200"
                            onClick={() => router.push(`/dashboard/placement/mock-drives/${enrollment.driveId}`)}
                        >
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isFullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900/95 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-8 max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Security Access Required</h2>
                        <p className="text-gray-500 mt-2">
                            This assessment requires strict full-screen mode.
                        </p>
                    </div>
                    <Button onClick={enterFullScreen} className="w-full bg-[#181C2E] text-white">
                        Enter Secure Mode
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQIndex];

    return (
        <div className="fixed inset-0 bg-gray-100 flex flex-col z-[99999] overflow-hidden select-none">
            {/* Warning Banner */}
            {warnings > 0 && !isCompleted && (
                <div className="bg-red-500 text-white px-4 py-1 text-xs text-center font-mono animate-pulse">
                    WARNING: {warnings} Security Violations Recorded.
                </div>
            )}

            {/* Webcam Monitor */}
            <WebcamMonitor />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-2 flex justify-between items-center shadow-sm z-10 shrink-0 h-16">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-[#181C2E] flex items-center gap-2">
                        <ListFilter className="w-4 h-4 text-gray-500" />
                        Aptitude Test
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-mono">
                        Q.{currentQIndex + 1}/{questions.length}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[#181C2E] font-mono font-bold text-lg bg-gray-100 px-3 py-1 rounded border border-gray-300">
                        <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
                        {formatTime(timeLeft)}
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleSubmit(false)} disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Finish Test'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50">
                    <div className="max-w-4xl mx-auto">
                        <Card className="min-h-[400px] border-0 shadow-md">
                            <div className="p-6 md:p-8 space-y-8">
                                <div className="space-y-4">
                                    <span className="text-gray-500 font-medium">Question {currentQIndex + 1}</span>
                                    <p className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed">
                                        {currentQuestion?.text}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        {currentQuestion?.options?.map((opt: any, idx: number) => {
                                            const optionId = opt.id || `opt-${idx}`;
                                            return (
                                                <div
                                                    key={optionId}
                                                    onClick={() => handleOptionSelect(optionId)}
                                                    className={`flex items-center space-x-3 border rounded-lg p-4 transition-colors cursor-pointer hover:bg-gray-50 ${answers[currentQuestion.id] === optionId ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${answers[currentQuestion.id] === optionId ? 'border-blue-600' : 'border-gray-400'}`}>
                                                        {answers[currentQuestion.id] === optionId && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                                    </div>
                                                    <Label className="flex-1 cursor-pointer font-normal text-base pointer-events-none">{opt.text}</Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-between items-center mt-8">
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="text-gray-600"
                                    disabled={currentQIndex === 0}
                                    onClick={() => setCurrentQIndex(c => c - 1)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    className={`${markedForReview.includes(currentQuestion?.id) ? 'bg-amber-100 text-amber-700 border-amber-300' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}
                                    onClick={toggleMarkReview}
                                >
                                    <Flag className={`w-4 h-4 mr-2 ${markedForReview.includes(currentQuestion?.id) ? 'fill-current' : ''}`} />
                                    {markedForReview.includes(currentQuestion?.id) ? 'Marked' : 'Mark for Review'}
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]" onClick={() => {
                                    if (currentQIndex < questions.length - 1) {
                                        setCurrentQIndex(c => c + 1);
                                    } else {
                                        handleSubmit(false);
                                    }
                                }}>
                                    <Save className="w-4 h-4 mr-2" /> {currentQIndex === questions.length - 1 ? 'Finish Test' : 'Save & Next'}
                                </Button>
                            </div>
                            <Button
                                variant="default"
                                className="bg-[#181C2E] hover:bg-gray-800"
                                onClick={() => {
                                    if (currentQIndex < questions.length - 1) setCurrentQIndex(c => c + 1);
                                }}
                            >
                                Skip <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Palette) */}
                <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col hidden md:flex shrink-0">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4">Question Palette</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"></div> Answered</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gray-300"></div> Not Visited</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div> Marked</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border border-blue-600"></div> Current</div>
                        </div>
                    </div>

                    <div className="flex-1 p-4">
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => {
                                const isCurrent = currentQIndex === idx;
                                const isAnswered = !!answers[q.id];
                                const isMarked = markedForReview.includes(q.id);

                                let bgClass = "bg-gray-100 text-gray-700 hover:bg-gray-200";
                                if (isMarked) bgClass = "bg-amber-500 text-white hover:bg-amber-600";
                                else if (isAnswered) bgClass = "bg-green-500 text-white hover:bg-green-600";
                                if (isCurrent) bgClass += " ring-2 ring-blue-600 ring-offset-2 z-10";

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQIndex(idx)}
                                        className={`h-10 w-10 text-sm font-medium rounded-md flex items-center justify-center transition-all ${bgClass}`}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <Button className="w-full bg-[#181C2E] hover:bg-gray-800" onClick={() => handleSubmit(false)}>
                            Submit Final Test
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
