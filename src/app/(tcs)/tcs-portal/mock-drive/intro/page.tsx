"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Play, Zap, BrainCircuit, UserCircle2, ChevronRight, LockOpen, Sparkles } from "lucide-react";
import { createMockDrive, getMockDriveStatus } from "@/app/actions/mock-drive";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function TCSMockDriveIntro() {
    const router = useRouter();
    const { data: session } = useSession();
    const [statusData, setStatusData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        async function loadStatus() {
            setLoading(true);
            try {
                const data = await getMockDriveStatus("TCS");
                setStatusData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadStatus();
    }, []);

    const handleStartDrive = async () => {
        setLoading(true);
        try {
            const res = await createMockDrive("TCS");
            if (res.success) {
                toast.success("Exam Environment Initialized");
                router.push(`/tcs-portal/test/aptitude?session=${res.sessionId}`);
            } else {
                toast.error("Failed to start drive. " + res.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleResume = () => {
        if (statusData?.activeSession?.lastActiveUrl) {
            router.push(`/tcs-portal/${statusData.activeSession.lastActiveUrl}`);
        } else {
            // Default to aptitude if no url
            router.push(`/tcs-portal/test/aptitude?session=${statusData?.activeSession?.id}`);
        }
    };

    const userName = session?.user?.name || "Candidate";
    const firstName = userName.split(" ")[0];

    // Status Helpers
    const isEligible = statusData?.eligibilityStatus === "ELIGIBLE";
    const isPending = statusData?.eligibilityStatus === "PENDING_DATA";
    const notEligible = statusData?.eligibilityStatus === "NOT_ELIGIBLE";

    // Session Helpers
    const activeSession = statusData?.activeSession;
    const latestSession = statusData?.latestSession;
    const isCompleted = latestSession?.status === "COMPLETED";

    // Default to latestSession currentRound if activeSession is null (for completed drives)
    const currentRound = activeSession?.currentRound || latestSession?.currentRound || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
            {/* Professional Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 px-6 py-4"
            >
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#181C2E] text-white p-1.5 rounded-lg">
                            <BrainCircuit className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl text-[#181C2E] tracking-tight">TCS<span className="text-blue-600">NQT</span> Simulation</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {isEligible && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Eligible
                            </Badge>
                        )}
                        {notEligible && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">
                                Not Eligible
                            </Badge>
                        )}
                        {isPending && (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0">
                                Profile Incomplete
                            </Badge>
                        )}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            <span>180 Mins Total</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                            <UserCircle2 className="w-4 h-4" />
                            {userName}
                        </div>
                    </div>
                </div>
            </motion.header>

            <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-12 gap-10"
                >
                    {/* Left Column: Welcome & Timeline */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#181C2E] leading-tight">
                                Hi {firstName}, your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Job</span> awaits.
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Welcome to the most realistic TCS NQT simulation. Master all 3 stages in one go to boost your placement confidence.
                            </p>
                        </motion.div>

                        {/* Unlocked Vertical Timeline */}
                        <div className="relative border-l-2 border-dashed border-gray-300 ml-4 md:ml-6 space-y-10 py-2">
                            {/* Round 1 */}
                            <motion.div variants={itemVariants} className="relative pl-8 md:pl-12 group">
                                <div className={`absolute -left-[9px] md:-left-[11px] top-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white shadow-md z-10 ${currentRound > 1 ? 'bg-green-500' : 'bg-blue-600'}`}>
                                    {currentRound > 1 && <CheckCircle2 className="w-full h-full text-white p-0.5" />}
                                </div>
                                <div className={`p-6 rounded-2xl shadow-sm border transition-all ${currentRound === 1 || currentRound === 0 ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' : 'bg-gray-50 border-gray-100 opacity-80'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                Foundation & Advanced
                                                {currentRound <= 1 && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">Up Next</Badge>}
                                                {currentRound > 1 && <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>}
                                            </h3>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mt-1">Integrated Assessment • 90 Mins</p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                            <LockOpen className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        Your gateway to the interview. Covers Numerical, Verbal, and Reasoning ability followed by Hands-on Coding.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="text-xs bg-gray-50">50 MCQs</Badge>
                                        <Badge variant="outline" className="text-xs bg-gray-50">2 Coding Qs</Badge>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Round 2 */}
                            <motion.div variants={itemVariants} className="relative pl-8 md:pl-12 group">
                                <div className={`absolute -left-[9px] md:-left-[11px] top-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white shadow-md z-10 ${currentRound > 2 ? 'bg-green-500' : (currentRound === 2 ? 'bg-indigo-600' : 'bg-gray-300')}`}></div>
                                <div className={`p-6 rounded-2xl shadow-sm border transition-all ${currentRound === 2 ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                Technical Interview
                                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0">
                                                    <Sparkles className="w-3 h-3 mr-1 fill-current" /> AI Powered
                                                </Badge>
                                                {currentRound === 2 && <Badge className="bg-indigo-100 text-indigo-700 border-0 ml-2">Current</Badge>}
                                            </h3>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mt-1">Video Assessment • 45 Mins</p>
                                        </div>
                                        <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm border border-indigo-100">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        An adaptive AI interviewer will assess your core technical skills, project knowledge, and problem-solving approach in real-time.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Round 3 */}
                            <motion.div variants={itemVariants} className="relative pl-8 md:pl-12 group">
                                <div className={`absolute -left-[9px] md:-left-[11px] top-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white shadow-md z-10 ${currentRound > 3 ? 'bg-green-500' : (currentRound === 3 ? 'bg-green-600' : 'bg-gray-300')}`}></div>
                                <div className={`p-6 rounded-2xl shadow-sm border transition-all ${currentRound === 3 ? 'bg-white border-green-200 shadow-md ring-1 ring-green-100' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">MR & HR Discussion</h3>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mt-1">Behavioral Fitment • 15 Mins</p>
                                        </div>
                                        <div className="bg-white p-2 rounded-lg text-green-600 shadow-sm border border-green-100">
                                            <UserCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Final behavioral check. Handles situational questions, salary expectations, and company culture fitment.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column: Action Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#181C2E] text-white rounded-2xl p-6 shadow-2xl shadow-blue-900/20 sticky top-28"
                        >
                            <h2 className="text-2xl font-bold mb-2">
                                {activeSession ? "Resume Drive" : "Ready to Launch?"}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                {activeSession
                                    ? `You are currently in Round ${activeSession.currentRound}. Continue where you left off.`
                                    : "The environment is prepped. Ensure you are in a quiet room with good lighting."
                                }
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="bg-green-500/20 p-1 rounded text-green-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    FullScreen Mode Enforced
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="bg-green-500/20 p-1 rounded text-green-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    Webcam & Mic Access
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="bg-green-500/20 p-1 rounded text-green-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    AI Proctoring Active
                                </div>
                            </div>

                            {isPending && (
                                <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-xs">
                                    ⚠️ Missing Profile Data: {statusData.missingFields.join(", ")}.
                                    <br />Please update your profile to check eligibility, or you can proceed purely for practice.
                                </div>
                            )}

                            {activeSession ? (
                                <Button
                                    onClick={handleResume}
                                    className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Resume Round {activeSession.currentRound}
                                    <Play className="ml-2 w-5 h-5 fill-current" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleStartDrive}
                                    disabled={loading}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? "Initializing..." : "Start Simulation"}
                                    {!loading && <Play className="ml-2 w-5 h-5 fill-current" />}
                                </Button>
                            )}

                            <p className="text-xs text-center text-gray-500 mt-4">
                                By starting, you agree to our integrity policy.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
