"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Code2, Terminal, Cpu, Info, LayoutTemplate, Sparkles } from "lucide-react";
import Link from 'next/link';

export default function CodingAssessmentPage() {
    const [code, setCode] = useState(`def find_pairs(arr, target):
    seen = set()
    pairs = []
    for num in arr:
        complement = target - num
        if complement in seen:
            pairs.append((complement, num))
        seen.add(num)
    return pairs
    
# Your efficient solution above`);

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-4">

            {/* Left Panel - Problem */}
            <div className="w-full lg:w-1/3 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
                <div className="p-1 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                            <Cpu className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700">Algorithm Challenge</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded uppercase">Hard</span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Two Sum Optimization</h2>
                        <p className="text-slate-500 leading-relaxed">
                            Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><LayoutTemplate className="w-4 h-4" /> Input Format</h3>
                            <code className="text-sm text-slate-600 block">nums = [2,7,11,15], target = 9</code>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Expected Output</h3>
                            <code className="text-sm text-slate-600 block">[0, 1]</code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Editor */}
            <div className="flex-1 bg-[#282a36] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-800">
                {/* Editor Header */}
                <div className="h-14 bg-[#1e2029] flex items-center justify-between px-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm font-medium">main.py</span>
                        <div className="h-4 w-px bg-white/10"></div>
                        <span className="text-xs text-green-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Auto-saved</span>
                    </div>

                    <Select defaultValue="python">
                        <SelectTrigger className="w-32 h-8 bg-[#282a36] border-white/10 text-slate-300 text-xs rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e2029] border-white/10 text-slate-300">
                            <SelectItem value="python">Python 3</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="cpp">C++</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Editor Body */}
                <div className="flex-1 relative font-mono">
                    <textarea
                        className="w-full h-full bg-[#282a36] text-[#f8f8f2] p-6 text-sm resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-[#44475a]"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                    />
                </div>

                {/* Bottom Panel (Tabs) */}
                <div className="h-1/3 bg-[#1e2029] border-t border-white/5 flex flex-col">
                    <Tabs defaultValue="console" className="flex-1 flex flex-col">
                        <div className="px-6 border-b border-white/5 flex items-center justify-between">
                            <TabsList className="bg-transparent h-12 p-0 space-x-6">
                                <TabsTrigger value="console" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-purple-400 text-slate-500 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-400 px-0 pb-3 mt-3 shadow-none">
                                    <Terminal className="w-4 h-4 mr-2" /> Console
                                </TabsTrigger>
                                <TabsTrigger value="testcases" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-purple-400 text-slate-500 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-400 px-0 pb-3 mt-3 shadow-none">
                                    <Info className="w-4 h-4 mr-2" /> Test Cases
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex gap-3 pb-2 pt-2">
                                <Button variant="secondary" size="sm" className="bg-[#44475a] text-white hover:bg-[#6272a4] border-0">Run Code</Button>
                                <Link href="/wipro-portal/interview">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-medium border-0"><Play className="w-3.5 h-3.5 mr-2 fill-current" /> Submit</Button>
                                </Link>
                            </div>
                        </div>

                        <TabsContent value="console" className="flex-1 p-6 font-mono text-xs text-slate-400 overflow-auto">
                            <div className="space-y-1">
                                <span className="text-[#50fa7b]">➜  ~ python main.py</span>
                                <br />
                                <span>Running test cases...</span>
                                <br />
                                <span className="text-[#ff79c6]">Error:</span> IndentationError: unexpected indent
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

        </div>
    );
}
