'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Play, RefreshCcw, CheckCircle, AlertCircle, ChevronRight, Volume2 } from 'lucide-react';
import { submitVoiceAssessment } from '@/app/actions/voice-assessment';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

const QUESTIONS = [
    {
        id: 1,
        title: 'Self Introduction',
        text: 'Please introduce yourself, highlighting your academic background and technical interests.',
        duration: 60,
        type: 'speech'
    },
    {
        id: 2,
        title: 'Problem Solving',
        text: 'Do you think Artificial Intelligence will replace software engineers? Explain your reasoning.',
        duration: 60,
        type: 'speech'
    },
    {
        id: 3,
        title: 'Reading Task',
        text: 'Cloud computing delivers computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet to offer faster innovation, flexible resources, and economies of scale.',
        duration: 45,
        type: 'reading'
    }
];

export default function VoiceAssessmentPage() {
    const [step, setStep] = useState<'instructions' | 'assessment' | 'processing' | 'result'>('instructions');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [recordings, setRecordings] = useState<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingRef = useRef(false);
    const [result, setResult] = useState<any>(null);

    // Cleanup function to stop all recording resources
    const cleanupRecording = () => {
        // Stop timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Stop MediaRecorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                mediaRecorderRef.current.stop();
            } catch (e) {
                console.error('Error stopping MediaRecorder:', e);
            }
            mediaRecorderRef.current = null;
        }

        // Stop all media tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            streamRef.current = null;
        }

        setIsRecording(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupRecording();
        };
    }, []);

    // Start Recording
    const startRecording = async () => {
        // Prevent starting if already recording
        if (isRecording || mediaRecorderRef.current) {
            console.warn('Recording already in progress');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Create blob only if we have chunks
                if (chunks.length > 0) {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    setRecordings(prev => [...prev, audioBlob]);
                }
                
                // Cleanup
                cleanupRecording();
                
                // Move to next question
                handleNextQuestion();
            };

            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                toast.error("Recording Error", { description: "Audio recording failed. Please try again." });
                cleanupRecording();
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTimeLeft(QUESTIONS[currentQuestionIndex].duration);

            // Timer
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            console.error("Error accessing mic:", err);
            toast.error("Access Denied", { description: "Microphone permission denied. Please allow microphone access." });
            cleanupRecording();
        }
    };

    const stopRecording = () => {
        // Guard: only stop if actually recording
        if (!isRecording || !mediaRecorderRef.current) {
            return;
        }

        // Guard: only stop if not already stopped
        if (mediaRecorderRef.current.state === 'inactive') {
            return;
        }

        try {
            mediaRecorderRef.current.stop();
        } catch (e) {
            console.error('Error stopping recording:', e);
            cleanupRecording();
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // All questions done, trigger finish
            finishAssessment();
        }
    };

    // Remove the useEffect that was causing duplicate submissions
    // We'll handle submission directly in handleNextQuestion

    const finishAssessment = async () => {
        // Prevent duplicate submissions
        if (isProcessingRef.current) {
            console.warn('Already processing submission');
            return;
        }

        // Guard: need at least one recording
        if (recordings.length === 0) {
            toast.error("No Recording", { description: "Please record at least one answer." });
            return;
        }

        isProcessingRef.current = true;
        setStep('processing');

        try {
            // Use the first recording (or combine if needed)
            const finalBlob = recordings[0];
            const formData = new FormData();
            formData.append('audio', finalBlob, 'recording.webm');

            const res = await submitVoiceAssessment(formData);
            
            if (res.success) {
                setResult(res.data);
                setStep('result');
            } else {
                toast.error("Submission Failed", { description: res.error || "Please try again." });
                setStep('instructions');
                setRecordings([]);
                setCurrentQuestionIndex(0);
                isProcessingRef.current = false;
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error("Network Error", { description: "Failed to submit assessment. Please check your connection." });
            setStep('instructions');
            setRecordings([]);
            setCurrentQuestionIndex(0);
            isProcessingRef.current = false;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* ---------- Header ---------- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 px-6">
                <div className="space-y-4">
                    <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Acoustic Analysis</p>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none">Voice <span className="text-primary italic">Engine</span></h1>
                    <p className="text-gray-500 font-medium text-lg mt-4 max-w-2xl">High-precision linguistic audit based on institutional proficiency standards.</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 'instructions' && (
                    <motion.div key="instructions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="px-6">
                        <Card className="rounded-none border-0 shadow-2xl overflow-hidden aivalytics-card">
                            <CardHeader className="p-12 border-b border-gray-50 bg-[#f0f9f8]/30">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-primary text-white flex items-center justify-center rounded-none shadow-xl shadow-primary/20">
                                        <Volume2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-1">Pre-Audit Briefing</p>
                                        <CardTitle className="text-3xl font-black text-gray-900 tracking-tighter">Evaluation Protocols</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-12 space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-6 bg-primary" />
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Environment Checks</h3>
                                        </div>
                                        <ul className="space-y-4">
                                            {[
                                                'Zero-decibel background noise environment required.',
                                                'Standardized hardware (Microphone) verification.',
                                                'Natural linguistic rhythm and tonal consistency.',
                                                'Institutional reading and reasoning segments.'
                                            ].map((text, i) => (
                                                <li key={i} className="flex items-start gap-4 group">
                                                    <div className="w-5 h-5 bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-primary/30 transition-colors">
                                                        <div className="w-1.5 h-1.5 bg-gray-200 group-hover:bg-primary transition-colors" />
                                                    </div>
                                                    <span className="text-gray-500 font-medium text-sm leading-relaxed">{text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-6 bg-primary" />
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Parameter Matrix</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Fluency', 'Enunciation', 'WPM Velocity', 'Clarity Index'].map((label, i) => (
                                                <div key={i} className="p-6 border border-gray-50 bg-gray-50/30 group hover:bg-white hover:border-primary/20 transition-all duration-500 shadow-sm">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Indicator 0{i + 1}</p>
                                                    <p className="font-black text-gray-900 tracking-tight">{label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-12 border-t border-gray-50 flex justify-center">
                                    <Button 
                                        onClick={() => setStep('assessment')} 
                                        className="h-20 px-16 rounded-none bg-gray-900 text-white hover:bg-black font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl transition-all hover:-translate-y-2 border-b-4 border-primary"
                                    >
                                        Initialize Engine <ChevronRight className="ml-4 w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 'assessment' && (
                    <motion.div key="assessment" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="px-6">
                        <Card className="rounded-none border-0 shadow-2xl overflow-hidden aivalytics-card">
                            <div className="h-2 bg-gray-50 w-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestionIndex) / QUESTIONS.length) * 100}%` }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                />
                            </div>
                            <CardHeader className="p-12 text-center pb-6">
                                <Badge className="mx-auto mb-6 rounded-none bg-primary/10 text-primary border-primary/20 px-6 py-2 font-black uppercase tracking-[0.3em] text-[9px] shadow-none">
                                    Module {currentQuestionIndex + 1} of {QUESTIONS.length}
                                </Badge>
                                <CardTitle className="text-4xl font-black text-gray-900 tracking-tighter">{QUESTIONS[currentQuestionIndex].title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-16 p-12 pt-6">
                                <div className="w-full max-w-3xl bg-gray-50 p-12 rounded-none border-l-[10px] border-primary shadow-inner text-center relative">
                                    <div className="absolute top-4 right-6 text-[10px] font-black text-gray-200 uppercase tracking-[0.4em]">Audit Text</div>
                                    <p className="text-2xl text-gray-900 leading-tight font-black tracking-tighter">
                                        "{QUESTIONS[currentQuestionIndex].text}"
                                    </p>
                                </div>

                                <div className="flex flex-col items-center justify-center space-y-8">
                                    {!isRecording ? (
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:bg-primary/40 transition-all duration-700" />
                                            <Button
                                                onClick={startRecording}
                                                className="w-32 h-32 rounded-none bg-gray-900 hover:bg-black text-white shadow-2xl transition-all hover:-translate-y-2 border-b-8 border-primary relative z-10 flex items-center justify-center"
                                            >
                                                <Mic size={48} className="text-primary" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-32 h-32 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 relative">
                                                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                                <Button 
                                                    onClick={stopRecording}
                                                    className="w-24 h-24 rounded-none bg-red-600 hover:bg-red-700 text-white shadow-2xl transition-all flex items-center justify-center border-b-4 border-red-900"
                                                >
                                                    <Square size={32} className="fill-current" />
                                                </Button>
                                            </div>
                                            <div className="px-10 py-4 bg-gray-900 text-white rounded-none font-black text-3xl tracking-widest shadow-2xl border-l-[6px] border-primary">
                                                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                                        {isRecording ? 'Acoustic Transmission Active' : 'Initialize registration sequence'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 'processing' && (
                    <motion.div key="processing" className="flex flex-col items-center justify-center min-h-[500px] px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="w-32 h-32 bg-gray-900 flex items-center justify-center relative shadow-2xl border-b-8 border-primary overflow-hidden">
                           <div className="absolute inset-0 bg-primary opacity-20 animate-pulse" />
                           <RefreshCcw className="w-12 h-12 text-primary animate-spin" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mt-12">Linguistics <span className="text-primary italic">Processing</span></h2>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs mt-4">Auditing Phonemes, Resonance & Cadence Velocity</p>
                    </motion.div>
                )}

                {step === 'result' && result && (
                    <motion.div key="result" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="px-6">
                        <Card className="rounded-none border-0 shadow-2xl overflow-hidden aivalytics-card">
                            <CardHeader className="p-12 text-center border-b border-gray-50 bg-gray-50/30">
                                <div className="mb-10 flex justify-center">
                                    {result.isPassed ? (
                                        <Badge className="rounded-none bg-primary text-white border-0 px-10 py-4 font-black uppercase tracking-[0.5em] text-xs shadow-2xl shadow-primary/30 flex gap-4">
                                            <CheckCircle size={18} /> Credentials Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive" className="rounded-none bg-gray-900 text-white border-0 px-10 py-4 font-black uppercase tracking-[0.5em] text-xs shadow-2xl flex gap-4">
                                            <AlertCircle size={18} /> Audit Deficiency
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-2">Overall Compliance Rating</p>
                                <CardTitle className="text-8xl font-black text-gray-900 tracking-tighter leading-none">{Math.round(result.totalScore)}<span className="text-2xl text-gray-400 font-medium tracking-widest ml-4">/ 100</span></CardTitle>
                            </CardHeader>
                            <CardContent className="p-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                                    <ScoreItem label="Lingual Fluency" score={result.fluencyScore} color="bg-primary" />
                                    <ScoreItem label="Enunciation" score={result.pronunciationScore} color="bg-primary" />
                                    <ScoreItem label="Cadence (WPM)" score={result.paceScore} color="bg-primary" />
                                    <ScoreItem label="Clarity Index" score={result.clarityScore} color="bg-primary" />
                                </div>

                                {result.status === 'HUMAN_REVIEW_PENDING' && (
                                    <div className="mt-16 p-10 bg-gray-900 border-l-[10px] border-primary text-white space-y-4">
                                        <div className="flex items-center gap-4">
                                            <AlertCircle className="w-8 h-8 text-primary" />
                                            <h4 className="font-black uppercase tracking-[0.2em] text-sm">Review Flag Active</h4>
                                        </div>
                                        <p className="text-gray-400 font-bold text-sm tracking-widest leading-relaxed uppercase">
                                            Confidence parameters below institutional threshold ({result.confidenceScore}%). Record archived for administrative oversight.
                                        </p>
                                    </div>
                                )}

                                <div className="mt-16 flex justify-center">
                                    <Button 
                                        onClick={() => { setStep('instructions'); setCurrentQuestionIndex(0); setRecordings([]); }} 
                                        className="h-16 px-12 rounded-none border border-gray-100 bg-white hover:bg-gray-50 text-gray-900 font-black uppercase tracking-widest text-[10px] transition-all flex gap-4 shadow-sm"
                                    >
                                        <RefreshCcw size={16} className="text-primary" /> Re-Initialize Engine
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ScoreItem({ label, score, color }: { label: string, score: number, color: string }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="font-black text-gray-900 tracking-tighter text-xl">{label}</p>
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Score</span>
                    <span className="font-black text-gray-900 text-sm tracking-widest">{score}<span className="text-gray-300 font-medium italic ml-1">/ 25</span></span>
                </div>
            </div>
            <div className="h-2 bg-gray-50 border border-gray-100 rounded-none overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / 25) * 100}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                    className={cn("h-full", color)} 
                />
            </div>
        </div>
    );
}
