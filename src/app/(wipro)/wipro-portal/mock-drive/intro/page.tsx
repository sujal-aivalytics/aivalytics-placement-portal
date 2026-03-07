"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, ArrowRight, Play, Cpu, Code, MessageSquare } from "lucide-react";
import { Spinner } from "@/components/ui/loader";
import { startMockSession } from "@/app/actions/mock-drive";
import { toast } from "sonner";

export default function WiproMockDriveIntro() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleStartDrive = async () => {
        setLoading(true);
        try {
            const res = await startMockSession("Wipro", "aptitude");
            if (res.success) {
                toast.success("Exam Environment Initialized");
                router.push(`/wipro-portal/test/aptitude?session=${res.sessionId}`);
            } else {
                toast.error("Failed to start drive. " + res.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-6 px-4 md:px-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl">W</div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Project Engineer Recruitment</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-0">Simulation 2026</Badge>
                                <span className="text-slate-500 text-sm">• Elite National Talent Hunt</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-10 space-y-10">

                <div className="grid md:grid-cols-12 gap-8">

                    {/* Left Column: Drive Stages */}
                    <div className="md:col-span-8 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Selection Process Roadmap</h2>
                            <div className="relative space-y-8 pl-8 md:pl-0">
                                {/* Vertical Line for mobile */}
                                <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-slate-200 md:hidden" />

                                {/* Stage 1 */}
                                <div className="relative group">
                                    <div className="md:absolute md:-left-12 md:top-6 w-8 h-8 rounded-full bg-slate-900 border-4 border-white shadow-lg flex items-center justify-center text-white text-xs z-10 hidden md:flex">1</div>
                                    <Card className="rounded-2xl border-0 shadow-sm group-hover:shadow-md transition-all overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
                                        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                                            <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
                                                <Cpu className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900">Cognitive & Technical Assessment</h3>
                                                <p className="text-slate-500 mt-2 leading-relaxed">
                                                    A comprehensive evaluation of your aptitude, logical reasoning, and English proficiency, followed by a coding challenge.
                                                </p>
                                                <div className="mt-4 flex flex-wrap gap-3">
                                                    <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">Quantitative</div>
                                                    <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">Logical</div>
                                                    <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">Verbal</div>
                                                    <div className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold">Coding (2 Qs)</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Stage 2 */}
                                <div className="relative group opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="md:absolute md:-left-12 md:top-6 w-8 h-8 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center text-slate-500 text-xs z-10 hidden md:flex">2</div>
                                    <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200" />
                                        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                                            <div className="p-4 rounded-xl bg-slate-50 text-slate-500">
                                                <MessageSquare className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-700">Business Discussion (Tech + HR)</h3>
                                                <p className="text-slate-500 mt-2 leading-relaxed">
                                                    A unified interview round assessing your technical depth and cultural fitment for the Project Engineer role.
                                                </p>
                                                <div className="mt-4 flex gap-3">
                                                    <Badge variant="outline" className="border-slate-200 text-slate-500">AI Simulated</Badge>
                                                    <Badge variant="outline" className="border-slate-200 text-slate-500">Video Response</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right Column: CTA */}
                    <div className="md:col-span-4 space-y-6">
                        <Card className="rounded-3xl border-0 shadow-xl shadow-purple-900/10 overflow-hidden bg-white">
                            <div className="bg-slate-900 p-6 text-white">
                                <h3 className="text-lg font-bold">Session Brief</h3>
                                <p className="text-slate-400 text-sm mt-1">Please review before starting.</p>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Total Duration</span>
                                        <span className="font-bold text-slate-900">160 Mins</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Questions</span>
                                        <span className="font-bold text-slate-900">60 Aptitude + 2 Code</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Platform Mode</span>
                                        <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-50">Strict Proctoring</Badge>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800 leading-relaxed">
                                    <AlertTriangle className="w-4 h-4 mb-2 text-amber-600" />
                                    This simulation cannot be paused. Ensure you have stable power and internet. Any attempt to switch tabs will be flagged.
                                </div>

                                <Button
                                    className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                                    onClick={handleStartDrive}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner size={24} className="mr-2" /> : "Start Examination"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
}
