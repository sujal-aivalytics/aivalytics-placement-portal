"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, FileCheck, Target, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* -------------------- 3D Tilt Card Component -------------------- */
// Midnight-Mint Theme Update

const ResumeCard3D = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            {/* Background Texture */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[120%] h-[120%] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] grayscale" />
                <div className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Sharp AiValytics Resume Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="group relative"
            >
                <div className="relative transform transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:rotate-1">
                    {/* Architectural Resume Card */}
                    <div className="relative w-72 md:w-80 bg-white rounded-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] group-hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden border border-gray-100 aivalytics-card">
                        {/* Card Header */}
                        <div className="bg-gray-900 p-5 border-b-4 border-primary">
                            <div className="flex items-center gap-3">
                                {/* Profile Avatar */}
                                <div className="w-14 h-14 rounded-none bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg">
                                    YR
                                </div>
                                <div className="text-white">
                                    <h3 className="font-black text-lg tracking-tighter leading-none">Yashodip Randive</h3>
                                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-1.5 italic">Senior Engine Architect</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-5">
                            {/* Experience Section */}
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Professional History</h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-6 bg-primary shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2.5 bg-gray-100 rounded-none w-full" />
                                            <div className="h-2 bg-gray-50 rounded-none w-3/4" />
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-6 bg-gray-200 shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2.5 bg-gray-100 rounded-none w-5/6" />
                                            <div className="h-2 bg-gray-50 rounded-none w-2/3" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2.5">Core Competencies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["React", "Node.js", "Python", "AWS"].map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2.5 py-1 bg-gray-50 text-gray-900 text-[10px] rounded-none font-black uppercase tracking-widest border border-gray-100 hover:border-primary/30 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* ATS Score */}
                            <div className="pt-3 border-t border-gray-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Compliance Rating</span>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-24 h-1.5 bg-gray-50 rounded-none overflow-hidden">
                                            <div className="h-full w-[85%] bg-primary" />
                                        </div>
                                        <span className="text-xs font-black text-primary italic">85%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Feature Tags */}
                    <div className="hidden md:block">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="absolute -left-8 top-1/4 transform -translate-x-full"
                        >
                            <div className="bg-gray-900 px-5 py-2.5 rounded-none shadow-xl border-l-4 border-primary flex items-center gap-2.5">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AI Refinement Active</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="absolute -right-8 top-1/3 transform translate-x-full"
                        >
                            <div className="bg-white px-5 py-2.5 rounded-none shadow-xl border-l-4 border-primary flex items-center gap-2.5">
                                <Target className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Compliance Optimized</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default function ResumeSimulatorPage() {
    return (
        <div className="min-h-screen bg-[#f8fcfb] p-6 md:p-10 animate-in fade-in duration-1000">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center min-h-[80vh]">
                    
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0f9f8] rounded-none border-l-4 border-primary">
                            <FileCheck className="w-4 h-4 text-primary" />
                            <span className="text-[11px] text-primary font-bold uppercase tracking-wider">Credential Engineering Core</span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tighter">
                                Architect Your <span className="text-primary italic">Professional</span> Dossier
                            </h1>
                            <div className="w-16 h-1 bg-gray-900" />
                        </div>

                        {/* Subtext */}
                        <p className="text-base text-gray-500 leading-relaxed max-w-xl">
                            Utilize industrial-grade architectural tools and standardized templates to construct 
                            a high-compliance resume designed for top-tier institutional acquisition.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Link href="/dashboard/resume-simulator/templates" className="flex-1">
                                <Button
                                    className="w-full h-11 rounded-none bg-gray-900 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm hover:bg-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md border-b-2 border-primary"
                                >
                                    Initialize Builder
                                </Button>
                            </Link>

                            <Link href="/dashboard/resume-simulator/templates?mode=upload" className="flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full h-11 rounded-none border border-gray-200 bg-white text-gray-900 text-[11px] font-bold uppercase tracking-wider shadow-sm hover:bg-gray-50 hover:border-primary/30 hover:text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2"
                                >
                                    <Upload className="w-4 h-4 text-primary" />
                                    Import Registry
                                </Button>
                            </Link>
                        </div>

                        {/* Feature List */}
                        <div className="pt-4 grid grid-cols-1 gap-3">
                            {[
                                { icon: Zap, text: "AI Content Distillation" },
                                { icon: Target, text: "Compliance Alignment" },
                                { icon: FileCheck, text: "Institutional Templates" },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-9 h-9 rounded-none bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
                                        <feature.icon className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-gray-900 transition-colors">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <div className="lg:col-span-3 h-[600px] flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
                        <ResumeCard3D />
                    </div>
                </div>
            </div>
        </div>
    );
}

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    variant === 'default' ? "bg-primary text-white hover:bg-primary/90" : "bg-transparent border border-gray-200 hover:bg-gray-50",
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"
