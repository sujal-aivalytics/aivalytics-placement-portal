import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BrainCircuit, Code2, Users, FileText, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { getOrCreatePlacementApplication, checkEligibility } from "@/app/actions/placement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Lock } from "lucide-react";
import { EligibilityActionWrapper } from "@/components/placement/eligibility-wrapper";
import { WiproVideo } from "./wipro-video";

export default async function WiproWelcomePage() {
    const { application, user } = await getOrCreatePlacementApplication("Wipro");
    const eligibility = await checkEligibility("Wipro");
    const userName = user?.name || "Candidate";

    const steps = [
        { title: "Registration", desc: "Profile Verified", icon: CheckCircle2, status: "completed", color: "text-green-500", bg: "bg-green-50" },
        { title: "Cognitive Assessment", desc: "Aptitude & Logic", icon: BrainCircuit, status: "current", color: "text-purple-600", bg: "bg-purple-50" },
        { title: "Coding Challenge", desc: "Hands-on Programming", icon: Code2, status: "upcoming", color: "text-slate-400", bg: "bg-slate-50" },
        { title: "Virtual Interview", desc: "Technical HR Round", icon: Users, status: "locked", color: "text-slate-400", bg: "bg-slate-50" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {!eligibility.isEligible && (
                <Alert variant="destructive" className="border-red-600/50 bg-red-50 text-red-900 border-l-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <ShieldAlert className="h-4 w-4 mt-1" />
                        <div>
                            <AlertTitle>Action Required: Eligibility Check</AlertTitle>
                            <AlertDescription>
                                Your academic profile is incomplete or unverifiable: {eligibility.reasons?.join(", ")}.
                            </AlertDescription>
                        </div>
                    </div>
                    <EligibilityActionWrapper
                        company="Wipro"
                        defaultValues={{
                            tenthPercentage: user?.tenthPercentage,
                            twelfthPercentage: user?.twelfthPercentage,
                            graduationCGPA: user?.graduationCGPA,
                            backlogs: user?.backlogs
                        }}
                    />
                </Alert>
            )}

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl shadow-purple-900/5 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

                <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1 space-y-6">
                        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 py-1.5 text-xs font-medium tracking-wide">
                            PROJECT ENGINEER RECRUITMENT • 2026
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 leading-tight">
                            Welcome {userName}, to the Future of Innovation.
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                            You are about to embark on Wipro's digital assessment journey. This process is designed to evaluate your technical aptitude and creative problem-solving skills.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {eligibility.isEligible ? (
                                <Link href="/wipro-portal/instructions">
                                    <Button className="h-12 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all">
                                        Start Assessment <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button disabled className="h-12 px-8 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed">
                                    Not Eligible <Lock className="ml-2 w-4 h-4" />
                                </Button>
                            )}
                            <Button variant="outline" className="h-12 px-8 rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-600">
                                View Guidelines
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border-4 border-white bg-slate-100">
                        <WiproVideo />
                    </div>
                </div>
            </div>

            {/* Mock Drive Simulation Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl shadow-purple-900/20 p-8 md:p-12 mb-8 border border-white/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/3" />
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-6 max-w-2xl">
                        <Badge className="bg-purple-600/20 text-purple-200 border border-purple-500/30 px-4 py-1.5 text-xs font-medium tracking-wide">
                            EXCLUSIVE SIMULATION
                        </Badge>
                        <h2 className="text-3xl font-bold text-white leading-tight">
                            Experience the Complete Wipro Hiring Drive
                        </h2>
                        <p className="text-lg text-slate-300">
                            Immerse yourself in a full-scale simulation of Wipro's recruitment process. From cognitive assessments to technical interviews, experience it all before the big day.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/wipro-portal/mock-drive/intro">
                                <Button className="h-12 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-lg shadow-white/10">
                                    Start Mock Drive <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Journey */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {steps.map((step, i) => (
                    <Card key={i} className={`border-0 shadow-lg ${step.status === 'current' ? 'shadow-purple-500/10 ring-2 ring-purple-100' : 'shadow-slate-200/50'} hover:shadow-xl transition-all`}>
                        <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
                            <div className={`p-3 rounded-2xl ${step.bg} ${step.color} mb-2`}>
                                <step.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`font-bold ${step.status === 'current' ? 'text-slate-900' : 'text-slate-700'}`}>{step.title}</h3>
                                <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                            </div>
                            <div className="mt-auto w-full pt-4">
                                {step.status === 'completed' && <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-700">Completed</Badge>}
                                {step.status === 'current' && <Badge className="w-full justify-center bg-purple-100 text-purple-700 hover:bg-purple-200 border-0 animate-pulse">In Progress</Badge>}
                                {(step.status === 'upcoming' || step.status === 'locked') && <Badge variant="outline" className="w-full justify-center text-slate-400 border-slate-200"><Lock className="w-3 h-3 mr-1.5" /> Locked</Badge>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    );
}
