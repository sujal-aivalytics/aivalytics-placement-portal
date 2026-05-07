"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MonitorPlay, Lock, Clock, ArrowRight, Info, ShieldAlert, Eye, MousePointerClick, AlertTriangle, CheckCircle2, PlayCircle, Loader2 } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { Loader } from "@/components/ui/loader";

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export default function MockTestsPage() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await fetch('/api/tests?type=mock');
                const data = await res.json();
                setTests(data.tests || []);
            } catch (error) {
                console.error("Failed to fetch mock tests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const getCompanyStyle = (companyName: string) => {
        const name = companyName?.toLowerCase() || '';
        if (name.includes('tcs')) return { color: 'bg-[#0067b1]', borderColor: '#0067b1', textColor: 'text-[#0067b1]' };
        if (name.includes('wipro')) return { color: 'bg-primary', borderColor: '#1eb2a6', textColor: 'text-primary' };
        return { color: 'bg-gray-900', borderColor: '#111827', textColor: 'text-gray-900' };
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
            >
                <div className="space-y-4">
                    <p className="text-ui-sm text-primary font-semibold uppercase tracking-wider">Institutional Assessments</p>
                    <h1 className="text-h1 text-gray-900 tracking-tight leading-none">Corporate <span className="text-primary italic">Simulations</span></h1>
                    <p className="text-body text-gray-500 mt-3 max-w-2xl">Premium proctored assessments simulating official recruitment environments and corporate standards.</p>
                </div>
                <div className="flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-none text-caption font-semibold uppercase tracking-wide border border-primary/20 shadow-inner">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    AI Surveillance Active
                </div>
            </motion.div>

            {/* Warning / Guidelines Banner */}
            <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Alert className="bg-gray-900 text-white border-0 shadow-2xl rounded-none p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <ShieldAlert className="h-8 w-8 text-primary relative z-10" />
                    <div className="relative z-10 ml-4">
                        <AlertTitle className="text-ui-sm font-semibold uppercase tracking-wider text-primary mb-2">Strict Proctored Protocol</AlertTitle>
                        <AlertDescription className="text-body-sm text-gray-400 font-medium max-w-3xl leading-relaxed">
                            These sessions are strictly monitored by our proprietary AI Surveillance System.
                            <span className="text-white mx-1">Browser tab transitions, unauthorized facial presence, or window resizing</span>
                            will result in immediate termination of the attempt.
                        </AlertDescription>
                    </div>
                </Alert>
            </motion.div>

            {/* Tests Registry */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-none aivalytics-card"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 bg-slate-50/50">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Simulation Target</th>
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Environment</th>
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Hardware Allocation</th>
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Metrics</th>
                                    <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Surveillance Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tests.map((test) => {
                                    const style = getCompanyStyle(test.company);
                                    const isInProgress = test.status === 'IN_PROGRESS';
                                    const isCompleted = test.status === 'COMPLETED';

                                    return (
                                        <motion.tr 
                                            key={test.id} 
                                            variants={itemVariants}
                                            className="group hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-none flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white shadow-sm border border-gray-100 bg-white`}>
                                                        <span className={`font-black text-xs uppercase tracking-tighter ${style.textColor}`}>{test.company?.substring(0, 3) || "AI"}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-lg group-hover:text-primary transition-colors tracking-tight">{test.title}</h4>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">{test.company || "CORPORATE STANDARD"}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-8">
                                                <Badge variant="outline" className="rounded-none border-gray-100 text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 text-gray-400">
                                                    {test.difficulty}
                                                </Badge>
                                            </td>

                                            <td className="py-8">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                        <MonitorPlay className="w-3.5 h-3.5 text-primary/40" /> {test._count?.questions || 0} Modules
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5 text-primary/40" /> {test.duration} Minutes
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-8">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-24 bg-gray-100 rounded-none overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: isCompleted ? '100%' : isInProgress ? '40%' : '0%' }}
                                                            className={`h-full ${isCompleted ? 'bg-primary' : 'bg-amber-400'}`}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">
                                                        {isCompleted ? '100%' : isInProgress ? 'Active' : 'Ready'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-10 py-8 text-right">
                                                <Link href={`/exam/${test.id}/dashboard`}>
                                                    <Button className={`rounded-none font-black uppercase tracking-widest text-[9px] px-6 py-2.5 border-0 shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                                                        isCompleted ? 'bg-primary text-white shadow-primary/20' : 
                                                        isInProgress ? 'bg-amber-400 text-white shadow-amber-400/20' : 
                                                        'bg-gray-900 text-white shadow-gray-900/20'
                                                    }`}>
                                                        {isInProgress ? 'Resume Audit' : isCompleted ? 'View Report' : 'Initialize'}
                                                    </Button>
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {tests.length === 0 && (
                        <div className="text-center py-32 bg-gray-50/50">
                            <p className="text-gray-300 font-black uppercase tracking-[0.2em] text-sm italic">No scheduled simulations identified.</p>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2">Drives will appear here upon institutional activation.</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Rules Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20"
            >
                <div className="bg-white p-10 border border-gray-100 shadow-xl rounded-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h3 className="text-h5 mb-8 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                        <AlertTriangle className="text-primary w-6 h-6" /> Malpractice Code
                    </h3>
                    <ul className="space-y-6">
                        {[
                            'Unauthorized window/tab transitions are strictly logged.',
                            'Usage of secondary electronic apparatus is forbidden.',
                            'Voice AI detects and flags unauthorized background conversations.'
                        ].map((rule, i) => (
                            <li key={i} className="flex gap-4">
                                <div className="w-2 h-2 bg-primary mt-1.5 shrink-0" />
                                <p className="text-caption font-semibold text-gray-400 uppercase tracking-wide leading-relaxed">{rule}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-10 border border-gray-100 shadow-xl rounded-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h3 className="text-h5 mb-8 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                        <CheckCircle2 className="text-primary w-6 h-6" /> Hardware Protocol
                    </h3>
                    <ul className="space-y-6">
                        {[
                            'Broadband Stability: Consistent 2Mbps+ Uplink.',
                            'Optical Sensor: Verified webcam for active proctoring.',
                            'Client Environment: Latest Chrome/Edge Stable Build.'
                        ].map((rule, i) => (
                            <li key={i} className="flex gap-4">
                                <div className="w-2 h-2 bg-primary mt-1.5 shrink-0" />
                                <p className="text-caption font-semibold text-gray-400 uppercase tracking-wide leading-relaxed">{rule}</p>
                            </li>
                        ))}
                    </ul>
                </div>

            </motion.div>

            {/* LEGAL DISCLAIMER */}
            <div className="pt-20 text-center max-w-4xl mx-auto px-10">
                <p className="text-caption text-gray-300 font-medium tracking-wider uppercase italic leading-relaxed">
                    Legal Disclaimer: AiValytics is an independent practice platform. Corporate entities mentioned (TCS, WIPRO) are proprietary trademarks of their respective owners. No affiliation or endorsement is implied.
                </p>
            </div>
        </div>
    );
}
