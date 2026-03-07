"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { WebcamMonitor } from "@/components/proctoring/webcam-monitor";
import { Button } from "@/components/ui/button";
import { AudioMonitor } from "@/components/proctoring/audio-monitor";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Save, Flag, Clock, AlertTriangle, ListFilter, Terminal, Play, Send, CheckCircle2, UserCheck, Briefcase, Award, Home, Mic, Camera, ShieldCheck, MonitorPlay } from "lucide-react";
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useProctoring } from "@/hooks/use-proctoring";
import { logMonitoringEvent } from "@/app/actions/monitoring";
// Removed invalid import: updateMockDriveProgress
import { wrapCode, getStarterCode } from "@/lib/code-execution";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/loader";
import { AIInterviewRunner } from "@/components/interview/ai-interview-runner";
import { cn } from "@/lib/utils";


const LANGUAGES = [
    { id: "python", name: "Python", version: "3.10.0", fileExt: "py" },
    { id: "java", name: "Java", version: "15.0.2", fileExt: "java" },
    { id: "c++", name: "C++", version: "10.2.0", fileExt: "cpp" },
    { id: "c", name: "C", version: "10.2.0", fileExt: "c" },
    { id: "javascript", name: "JavaScript", version: "18.15.0", fileExt: "js" },
];

const DEFAULT_CODE: Record<string, string> = {
    python: `def solve():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
    java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`,
    "c++": `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}`,
    javascript: `// Write your code here\nconsole.log("Hello World");`
};

export default function TestRunnerClient({ test, session }: { test: any, session: any }) {
    const router = useRouter();
    // No need for params.id if we have test object passed in, but can use if needed.
    const testId = test.id;

    const [loading, setLoading] = useState(false); // Data is passed in now
    const [allQuestions] = useState<any[]>(test.questions || []);

    // New State for Environment Check
    const [testStage, setTestStage] = useState<'ENV_CHECK' | 'TEST'>('ENV_CHECK');

    // Flow State
    // Initial round index calculation
    // calculatedRounds will be used to determine mapping

    // --- Round Grouping Logic ---
    const rounds = useMemo(() => {
        if (!test?.subtopics || test.subtopics.length === 0) {
            return [{ title: "Assessment", type: "assessment", sections: [{ id: 'general', name: 'General', questions: allQuestions }] }];
        }

        const groups = new Map<string, any>();
        let voiceQuestions: any[] = [];

        // Sort subtopics by order first
        const sortedSubtopics = [...test.subtopics].sort((a: any, b: any) => a.order - b.order);

        // First pass: Group normal rounds and collect voice questions
        sortedSubtopics.forEach((sub: any) => {
            const title = sub.roundTitle || "General Assessment";
            const type = sub.type || 'assessment';

            // Filter questions for this subtopic
            let subQuestions = allQuestions.filter((q: any) => q.subtopicId === sub.id);

            // Check for voice questions (assuming type or subtopic indicates voice)
            // For now, let's assume if the round title implies Technical and questions are interviewish or explicitly voice
            // Or allow filtering by question type if available. 
            // If question.type === 'voice' does not exist, we might need heuristic.
            // Let's assume we want to split "Technical Assessment" that has multiple question types.

            const nonVoiceQuestions = subQuestions.filter((q: any) => q.type !== 'voice' && q.type !== 'audio');
            const currentVoiceQuestions = subQuestions.filter((q: any) => q.type === 'voice' || q.type === 'audio');

            voiceQuestions = [...voiceQuestions, ...currentVoiceQuestions];

            // If we have non-voice questions or it's an interview round (which might have 0 questions listed if purely AI handled)
            if (nonVoiceQuestions.length > 0 || type === 'interview') {
                if (!groups.has(title)) {
                    groups.set(title, {
                        title,
                        type,
                        sections: [],
                        minOrder: sub.order
                    });
                }
                groups.get(title).sections.push({ ...sub, questions: nonVoiceQuestions });
            }
        });

        const roundsList = Array.from(groups.values()).sort((a, b) => {
            const minOrderA = a.minOrder || 999;
            const minOrderB = b.minOrder || 999;

            // Use same priority logic as Dashboard
            if (minOrderA === minOrderB) {
                const getPriority = (t: string, title: string) => {
                    t = (t || '').toLowerCase(); title = (title || '').toLowerCase();
                    if (t === 'assessment') return 1;
                    if (t === 'coding') return 2;
                    if (title.includes('technical') || t.includes('technical')) return 3;
                    if (title.includes('hr') || t.includes('hr')) return 4;
                    return 5;
                };
                return getPriority(a.type, a.title) - getPriority(b.type, b.title);
            }
            return minOrderA - minOrderB;
        });

        // Add Voice Assessment Round if questions exist
        // Or if we specifically want a Voice Round even without explicit voice questions (e.g. AI interview mode)
        // But for now, let's append it if we found voice questions OR if we want to force it.
        // If the user wants "Voice Assessment" instead of "Technical" having voice Qs.
        if (voiceQuestions.length > 0) {
            roundsList.push({
                title: "Voice Assessment",
                type: "assessment", // Or 'interview' if it uses AI runner? Let's stick to assessment UI for now unless requested
                sections: [{ id: 'voice_sec', name: 'Voice Questions', questions: voiceQuestions }],
                minOrder: 9999
            });
        }

        // Adjust for dedicated AI Voice/HR rounds logic if they were part of subtopics
        // If existing Technical was meant to be voice, we might have just stripped it.
        // Assuming Standard flow.

        console.log("DEBUG: Computed Rounds:", roundsList);
        roundsList.forEach(r => console.log(`Round: ${r.title}, Type: ${r.type}, Sections: ${r.sections.length}`));

        return roundsList;
    }, [test, allQuestions]);


    // Determine initial activeRoundIndex based on session
    const [activeRoundIndex, setActiveRoundIndex] = useState(() => {
        if (session && session.currentRound) {
            // session.currentRound is 1-based index usually, but let's check mapping.
            // In Dashboard we assumed direct mapping.
            // If session.currentRound = 1 -> Index 0
            // If session.currentRound = 2 -> Index 1
            const index = (session.currentRound || 1) - 1;
            return Math.min(Math.max(0, index), rounds.length - 1);
        }
        return 0;
    });

    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [markedForReview, setMarkedForReview] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);

    // Evaluation State
    const [roundVerdict, setRoundVerdict] = useState<"Pending" | "Cleared" | "Failed">("Pending");
    const [showRoundTransition, setShowRoundTransition] = useState(false);

    // Coding state
    const [code, setCode] = useState(DEFAULT_CODE['python']);
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [verdict, setVerdict] = useState<"Passed" | "Failed" | null>(null);

    const currentRound = rounds[activeRoundIndex];
    const currentSection = currentRound?.sections[activeSectionIndex];
    const activeQuestions = currentSection?.questions || [];
    const currentQuestion = activeQuestions[currentQuestionIndex];

    const isInterview = currentRound?.type === 'interview';
    const isCoding = !isInterview && (currentQuestion?.type === 'coding' || currentQuestion?.type === 'code');
    // Strict proctoring only starts when testStage is TEST
    const isStrictProctored = testStage === 'TEST' && !isInterview;

    // Environment Check State
    const [cameraPermission, setCameraPermission] = useState(false);
    const [micPermission, setMicPermission] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);


    const { isFullScreen, enterFullScreen, warnings } = useProctoring({
        forceFullScreen: isStrictProctored,
        preventTabSwitch: isStrictProctored,
        preventContextMenu: isStrictProctored,
        preventCopyPaste: isStrictProctored,
        onViolation: (type, msg) => {
            if (testStage === 'TEST') {
                toast.warning(`Warning ${warnings + 1}: ${msg}`);
                // Optional: Auto-submit if too many warnings
            }
        }
    });

    useEffect(() => {
        if (testStage === 'TEST') {
            // Sync internal fullscreen state with hook
            if (!isFullScreen) {
                // Hook handles toast
            }
        }
    }, [isFullScreen, testStage]);


    // --- Helper for Auto-Save ---
    const saveCurrentState = useCallback(() => {
        if (currentQuestion?.type === 'coding' || currentQuestion?.type === 'code') {
            setAnswers(prev => ({ ...prev, [currentQuestion.id]: code }));
        }
    }, [currentQuestion, code]);

    // --- Timer Management ---
    useEffect(() => {
        if (!currentRound || testStage !== 'TEST') return;

        const roundKey = `mock_drive_timer_${testId}_${activeRoundIndex}`;
        const storedStart = localStorage.getItem(roundKey);
        const now = Math.floor(Date.now() / 1000);
        let duration = (test?.duration || 60) * 60; // Default

        if (isInterview) {
            duration = 30 * 60; // 30 mins for interview
        }

        if (storedStart) {
            const elapsed = now - parseInt(storedStart);
            const remaining = Math.max(0, duration - elapsed);
            setTimeLeft(remaining);
        } else {
            localStorage.setItem(roundKey, now.toString());
            setTimeLeft(duration);
        }

    }, [activeRoundIndex, isInterview, test, testStage, testId]);


    // Timer Tick
    useEffect(() => {
        if (!timeLeft || showRoundTransition || loading || testStage !== 'TEST') return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, showRoundTransition, loading, testStage]);

    const handleTimeUp = () => {
        toast.warning("Time's up for this round!");
        handleNextRound();
    };

    // --- Submission & Navigation ---

    const submitTest = async (status: string) => {
        toast.info("Submitting Test Result...");
        setLoading(true);
        try {
            // Submit to API for marking
            const response = await fetch('/api/submit-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testId,
                    answers,
                    language
                })
            });

            if (!response.ok) throw new Error("Submission failed");

            const result = await response.json();

            // Removed call to non-existent updateMockDriveProgress

            // Redirect with justFinished flag
            router.push(`/exam/${testId}/result?score=${result.score}&total=${result.total}&verdict=${result.verdict}&type=${currentRound.type || 'assessment'}&justFinished=true`);
        } catch (e) {
            console.error(e);
            toast.error("Failed to submit. Please try again.");
            setLoading(false);
        }
    };

    // Evaluate Round (Mock Logic)
    const evaluateAssessment = () => {
        const answeredCount = Object.keys(answers).length;
        return answeredCount > 0; // Simple check
    };

    const handleNextRound = async () => {
        // If Assessment -> Check if cleared
        if (currentRound.type === 'assessment' || currentRound.type === 'coding') {
            const cleared = evaluateAssessment();
            // Assuming cleared for prototype unless implemented otherwise
            setRoundVerdict("Cleared");
            setShowRoundTransition(true);
        } else {
            // Interview finished
            setRoundVerdict("Cleared");
            setShowRoundTransition(true);
        }
    };


    const proceedToNextRound = async () => {
        // Clear timer for completed round
        localStorage.removeItem(`mock_drive_timer_${testId}_${activeRoundIndex}`);

        if (activeRoundIndex < rounds.length - 1) {
            const nextRoundNumber = activeRoundIndex + 2; // 0-based index -> 1-based next round

            // Update Session on Backend
            // Removed call to non-existent updateMockDriveProgress
            toast.success("Round completed. returning to action center.");
            router.push(`/exam/${testId}/dashboard`);
        } else {
            // All done (Last round)
            submitTest("Completed");
        }
    };

    const handleNextSection = () => {
        if (activeSectionIndex < currentRound.sections.length - 1) {
            setActiveSectionIndex(prev => prev + 1);
            setCurrentQuestionIndex(0);
            toast.info(`Starting next section: ${currentRound.sections[activeSectionIndex + 1].name}`);
        } else {
            handleNextRound();
        }
    };

    const handleOptionSelect = (val: string) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
    };

    const toggleMarkReview = () => {
        if (!currentQuestion) return;
        setMarkedForReview(prev =>
            prev.includes(currentQuestion.id)
                ? prev.filter(id => id !== currentQuestion.id)
                : [...prev, currentQuestion.id]
        );
    };

    const handleLanguageChange = (val: string) => {
        setLanguage(val);
        if (!currentQuestion) return;
        if (!answers[currentQuestion.id]) {
            const metadata = getCodingMetadata(currentQuestion);
            const starter = getStarterCode(val, {
                functionName: metadata?.functionName,
                inputStructure: metadata?.inputStructure || [],
                outputType: metadata?.outputType
            });
            setCode(starter || DEFAULT_CODE[val] || "");
        }
    };

    // Sync code
    useEffect(() => {
        if (currentQuestion?.type === 'coding' || currentQuestion?.type === 'code') {
            const savedCode = answers[currentQuestion.id];
            if (savedCode) {
                setCode(savedCode);
            } else {
                const metadata = getCodingMetadata(currentQuestion);
                const starter = getStarterCode(language, {
                    functionName: metadata?.functionName,
                    inputStructure: metadata?.inputStructure || [],
                    outputType: metadata?.outputType
                });
                setCode(starter || DEFAULT_CODE[language] || "");
            }
        }
    }, [currentQuestion, answers, language]);

    const [testCaseResults, setTestCaseResults] = useState<any[]>([]);

    const getCodingMetadata = (q: any) => {
        if (q?.type !== 'coding' || !q?.metadata) return null;
        try { return JSON.parse(q.metadata); } catch (e) { return {}; }
    };

    const runCode = async () => {
        const metadata = getCodingMetadata(currentQuestion);
        if (!metadata?.testCases?.length) { toast.error("No test cases."); return; }
        setIsRunning(true);
        setOutput("Running Test Cases...");
        setTestCaseResults([]);
        setVerdict(null);

        const langConfig = LANGUAGES.find(l => l.id === language);
        let allPassed = true;
        const results: any[] = [];

        try {
            // Run sequentially to avoid rate limits or confusion
            const wrappedCode = wrapCode(code, language, {
                functionName: metadata.functionName,
                inputStructure: metadata.inputStructure || []
            });

            for (let i = 0; i < metadata.testCases.length; i++) {
                const testCase = metadata.testCases[i];
                try {
                    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            language: langConfig?.id, version: langConfig?.version,
                            files: [{ content: wrappedCode }], stdin: testCase.input
                        })
                    });
                    const data = await res.json();
                    if (data.run) {
                        const rawOutput = data.run.output?.trim();
                        const expected = testCase.output?.trim();
                        const passed = rawOutput === expected;

                        if (!passed) allPassed = false;

                        results.push({
                            id: i,
                            input: testCase.input,
                            expected: expected,
                            actual: rawOutput,
                            stderr: data.run.stderr,
                            passed
                        });
                    } else {
                        allPassed = false;
                        results.push({ id: i, error: "Execution Failed", passed: false });
                    }
                } catch (err) {
                    allPassed = false;
                    results.push({ id: i, error: "Connection Error", passed: false });
                }
            }

            setTestCaseResults(results);

            if (allPassed) {
                setVerdict("Passed");
                toast.success("All Test Cases Passed!");
            } else {
                setVerdict("Failed");
                toast.error("Some Test Cases Failed");
            }

            // Summary for the simple text output box (fallback)
            const summary = results.map((r, i) =>
                `Case ${i + 1}: ${r.passed ? 'PASSED' : 'FAILED'} ${r.stderr ? `(Error: ${r.stderr})` : ''}`
            ).join('\n');
            setOutput(summary);

        } catch (e) {
            setOutput("Execution Process Failed");
            console.error(e);
        } finally {
            setIsRunning(false);
        }
    };

    const saveCodingAnswer = () => {
        if (!currentQuestion) return;
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: code }));
        toast.success("Saved");
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Environment Check Helper
    const checkEnvironment = async () => {
        setLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().forEach(track => track.stop()); // Just check permissions


            // Error Overlay (Permissions)
            setCameraPermission(true);
            setMicPermission(true);

            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
                setFullScreen(true);
            }

            setTestStage('TEST');
            toast.success("Environment Check Passed. Starting Test...");
        } catch (err: any) {
            toast.error("Failed access camera/mic: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    // --- RENDER ---

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Spinner size={24} className="text-emerald-600" />
        </div>
    );

    // 1. Environment Check Screen
    if (testStage === 'ENV_CHECK') {
        return (
            <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
                <Card className="max-w-xl w-full p-8 shadow-xl border-t-4 border-t-blue-600">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" /> Environment Check
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Before starting the assessment, we need to verify your system integrity and grant necessary permissions.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Camera className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">Webcam Check</h4>
                                <p className="text-xs text-gray-500">Required for proctoring</p>
                            </div>
                            {cameraPermission ? <CheckCircle2 className="text-green-500" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                        </div>

                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Mic className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">Microphone Check</h4>
                                <p className="text-xs text-gray-500">Required for voice assessment</p>
                            </div>
                            {micPermission ? <CheckCircle2 className="text-green-500" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                        </div>

                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <MonitorPlay className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">Full Screen Mode</h4>
                                <p className="text-xs text-gray-500">Strict mode enabled</p>
                            </div>
                            {fullScreen ? <CheckCircle2 className="text-green-500" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                        </div>
                    </div>

                    <Button onClick={checkEnvironment} className="w-full h-12 text-lg bg-[#181C2E] text-white hover:bg-[#2a3045]">
                        Run Checks & Start Exam
                    </Button>
                </Card>
            </div>
        )
    }

    // 2. Strict Proctoring Overlay (Only active during TEST stage)
    if (isStrictProctored && !isFullScreen && !showRoundTransition) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white flex-col gap-6 z-50 fixed inset-0 font-sans">
                <div className="p-8 bg-gray-900 rounded-2xl border border-red-500/30 shadow-2xl flex flex-col items-center text-center max-w-lg">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-white">Proctoring Alert</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Full-screen mode is mandatory for this assessment.
                        Exiting full-screen is recorded as a violation.
                    </p>
                    <Button onClick={enterFullScreen} className="w-full bg-red-600 hover:bg-red-700 h-14 text-lg font-medium rounded-xl transition-all">
                        Return to Full Screen
                    </Button>
                </div>
            </div>
        )
    }

    // 3. Transition Screen
    if (showRoundTransition) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-xl">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{currentRound.title} Completed</h2>
                        <p className="text-gray-500 mt-2">
                            You have completed this round.
                            {activeRoundIndex < rounds.length - 1 ? " Proceed to the next stage." : " All rounds completed."}
                        </p>
                    </div>
                    {activeRoundIndex < rounds.length - 1 ? (
                        <Button onClick={proceedToNextRound} className="w-full bg-[#181C2E] text-white py-6 text-lg">
                            Proceed to Next Round (Dashboard)
                        </Button>
                    ) : (
                        <Button onClick={() => {
                            saveCurrentState();
                            submitTest("Completed");
                        }} className="w-full bg-green-600 text-white">
                            View Final Result
                        </Button>
                    )}
                </Card>
            </div>
        );
    }

    // Empty Fallback
    if (!currentRound) return <div>No rounds loaded.</div>;



    const handleNext = () => {
        saveCurrentState();
        if (currentQuestionIndex < activeQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleNextSection();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden select-none bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-2 flex justify-between items-center shadow-sm z-10 shrink-0 h-16">
                <div className="flex items-center gap-4 overflow-hidden flex-1">
                    <Link href={`/exam/${testId}/dashboard`} title="Exit to Dashboard">
                        <Button variant="ghost" size="icon" className="hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors shrink-0">
                            <Home className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-gray-200 shrink-0" />

                    {/* Stepper / Round Status */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-right px-2">
                        {rounds.map((round, idx) => {
                            let status = 'pending';
                            if (activeRoundIndex > idx) status = 'completed';
                            else if (activeRoundIndex === idx) status = 'current';

                            return (
                                <div key={idx} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors",
                                    status === 'current' ? "bg-[#181C2E] text-white border-[#181C2E]" :
                                        status === 'completed' ? "bg-green-50 text-green-700 border-green-200" :
                                            "bg-white text-gray-400 border-gray-200"
                                )}>
                                    {status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                                        status === 'current' ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> :
                                            <span className="w-3 h-3 flex items-center justify-center text-[9px] border rounded-full border-gray-300">{idx + 1}</span>}
                                    {round.title}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <div className={`flex items-center gap-2 font-mono font-bold text-sm md:text-lg px-2 md:px-3 py-1 rounded border ${isInterview ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                        <Clock className="w-4 h-4 md:w-5 md:h-5" />
                        {formatTime(timeLeft)}
                    </div>
                    <Button variant="default" className="bg-[#181C2E] hover:bg-gray-800 h-8 md:h-10 text-xs md:text-sm px-2 md:px-4" size="sm" onClick={handleNext}>
                        {activeSectionIndex === currentRound.sections.length - 1 && currentQuestionIndex === activeQuestions.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className={`flex-1 flex ${isCoding ? 'bg-white' : 'p-4 md:p-10 overflow-y-auto'}`}>

                    {/* INTERVIEW UI */}
                    {isInterview ? (
                        <div className="w-full h-full p-0 md:p-4 flex flex-col">
                            <AIInterviewRunner
                                interviewType={currentRound.title.toLowerCase().includes('technical') ? 'Technical' : 'HR'}
                                companyName={session?.company || 'TCS'}
                                onFinish={handleNextRound}
                            />
                        </div>
                    ) : isCoding ? (


                        (() => {
                            const metadata = getCodingMetadata(currentQuestion);
                            return (
                                <div className="flex flex-col md:flex-row w-full h-full">
                                    <div className="w-full md:w-1/3 h-[30%] md:h-full bg-white border-b md:border-b-0 md:border-r flex flex-col shrink-0">
                                        <div className="p-4 md:p-6 border-b">
                                            <h1 className="text-lg md:text-xl font-bold">{currentQuestion?.text}</h1>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                                            {metadata && (
                                                <div className="space-y-4 text-xs md:text-sm">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 mb-1">Input Format</h3>
                                                        <p className="text-gray-600 bg-gray-50 p-2 rounded border">{metadata.inputFormat}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 mb-1">Output Format</h3>
                                                        <p className="text-gray-600 bg-gray-50 p-2 rounded border">{metadata.outputFormat}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Test Cases Display */}
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                                                    Test Cases
                                                    {testCaseResults.length > 0 && (
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${verdict === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {verdict === 'Passed' ? 'All Passed' : 'Some Failed'}
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="space-y-3">
                                                    {testCaseResults.length > 0 ? (
                                                        testCaseResults.map((res: any, idx: number) => (
                                                            <div key={idx} className={`p-3 rounded-lg border text-xs ${res.passed ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="font-medium text-gray-700">Case {idx + 1}</span>
                                                                    {res.passed ? (
                                                                        <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3 h-3" /> Passed</span>
                                                                    ) : (
                                                                        <span className="flex items-center gap-1 text-red-600"><AlertTriangle className="w-3 h-3" /> Failed</span>
                                                                    )}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <span className="text-gray-500 block mb-0.5">Input</span>
                                                                        <code className="block bg-white p-1.5 rounded border border-gray-100">{res.input}</code>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-500 block mb-0.5">Expected</span>
                                                                        <code className="block bg-white p-1.5 rounded border border-gray-100">{res.expected}</code>
                                                                    </div>
                                                                    {!res.passed && (
                                                                        <div className="col-span-2 mt-1">
                                                                            <span className="text-red-500 block mb-0.5">Actual Output</span>
                                                                            <code className="block bg-white p-1.5 rounded border border-red-100 text-red-700">{res.actual || "No Output"}</code>
                                                                            {res.stderr && <code className="block mt-1 text-red-600 whitespace-pre-wrap">{res.stderr}</code>}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        metadata?.testCases?.map((tc: any, idx: number) => (
                                                            <div key={idx} className="p-3 rounded-lg border border-gray-200 bg-gray-50/50 text-xs">
                                                                <span className="font-medium text-gray-700 block mb-2">Case {idx + 1}</span>
                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <span className="text-gray-500 block mb-0.5">Input</span>
                                                                        <code className="block bg-white p-1 rounded border border-gray-200">{tc.input}</code>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-500 block mb-0.5">Output</span>
                                                                        <code className="block bg-white p-1 rounded border border-gray-200">{tc.output}</code>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col bg-[#1e1e1e] h-[70%] md:h-full">
                                        <div className="bg-[#2d2d2d] p-2 flex justify-between items-center bg-zinc-800 border-b border-zinc-700">
                                            <Select value={language} onValueChange={handleLanguageChange}>
                                                <SelectTrigger className="w-28 md:w-32 bg-[#333] border-0 text-white h-8 text-xs"><SelectValue /></SelectTrigger>
                                                <SelectContent>{LANGUAGES.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="bg-green-600 h-8 text-xs" onClick={runCode}>{isRunning ? 'Running...' : 'Run Code'}</Button>
                                                <Button size="sm" className="bg-blue-600 h-8 text-xs" onClick={saveCodingAnswer}>Save</Button>
                                            </div>
                                        </div>
                                        <textarea className="flex-1 bg-[#1e1e1e] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none" value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
                                        <div className="h-24 md:h-32 bg-black text-gray-400 p-2 font-mono text-xs md:text-sm border-t border-gray-700 overflow-y-auto">
                                            <pre className="whitespace-pre-wrap">{output || "Console Output..."}</pre>
                                        </div>
                                    </div>
                                </div>
                            )
                        })()
                    ) : (
                        // Standard MCQ UI
                        <div className="max-w-4xl mx-auto w-full pb-10">
                            <Card className="min-h-[400px] border-0 shadow-md p-4 md:p-8">
                                <span className="text-gray-500 font-medium text-sm">Question {currentQuestionIndex + 1}</span>
                                <p className="text-base md:text-xl font-medium text-gray-900 mt-4 mb-8 leading-relaxed">{currentQuestion?.text}</p>
                                <div className="space-y-3">
                                    {currentQuestion?.options?.map((opt: any) => (
                                        <div key={opt.id} onClick={() => handleOptionSelect(opt.id)}
                                            className={`flex items-start md:items-center space-x-3 border rounded-lg p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors ${answers[currentQuestion.id] === opt.id ? 'border-blue-600 bg-blue-50 ring-1' : 'border-gray-200'}`}>
                                            <div className={`w-4 h-4 rounded-full border mt-1 md:mt-0 shrink-0 ${answers[currentQuestion.id] === opt.id ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`} />
                                            <span className="flex-1 text-sm md:text-base">{opt.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <div className="flex justify-between mt-8 mb-8 md:mb-0">
                                <Button variant="outline" onClick={() => setCurrentQuestionIndex(c => Math.max(0, c - 1))} disabled={currentQuestionIndex === 0}>Previous</Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="text-amber-600 hidden md:flex" onClick={toggleMarkReview}>Mark Review</Button>
                                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                                        if (currentQuestionIndex < activeQuestions.length - 1) setCurrentQuestionIndex(c => c + 1);
                                        else handleNextSection();
                                    }}>Save & Next</Button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                {/* Sidebar (Palette) - Keep simple */}
                {!isCoding && !isInterview && (
                    <div className="w-72 bg-white border-l p-4 hidden lg:block overflow-y-auto">
                        <h3 className="font-bold mb-4">Questions</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {activeQuestions.map((q: any, i: number) => (
                                <button key={q.id} onClick={() => setCurrentQuestionIndex(i)}
                                    className={`h-8 w-8 rounded flex items-center justify-center text-sm font-medium ${currentQuestionIndex === i ? 'ring-2 ring-blue-600' : ''} ${answers[q.id] ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {/* Disclaimer Watermark */}
                <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-40 text-[8px] md:text-[10px] text-gray-300 pointer-events-none select-none opacity-50 whitespace-nowrap">
                    SkillSprint Mock Evaluation • Educational Purpose Only • Not Affiliated with Official Brand
                </div>

                {/* <WebcamMonitor /> logic handled inside components or only show if not interview to avoid duplicate cams */}
                {!isInterview && <WebcamMonitor />}
                {!isInterview && (
                    <AudioMonitor
                        testId={testId}
                        isActive={isStrictProctored && !loading && !showRoundTransition}
                        intervalSeconds={30}
                        onViolation={(msg) => {
                            toast.warning(msg);
                            // Only 5 warnings allowed? Logic can be merged with generic warnings if passed up
                        }}
                    />
                )}
            </div>
        </div>
    );
}

// Helper component for badge
function Badge({ children, variant, className }: any) {
    return <span className={`text-xs px-2 py-0.5 rounded ${className}`}>{children}</span>
}


