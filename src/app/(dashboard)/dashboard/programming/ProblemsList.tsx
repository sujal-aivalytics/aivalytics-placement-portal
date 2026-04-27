"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
    Search, 
    ListFilter, 
    Circle, 
    Youtube, 
    FileText, 
    PlusCircle, 
    Star, 
    Code2,
    CheckCircle,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProblemsListProps {
    problems: any[];
}

export default function ProblemsList({ problems }: ProblemsListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const categories = ["All", "Arrays", "Strings", "DP", "Graphs", "Math"];

    // Filter logic
    const filteredProblems = useMemo(() => {
        return problems.filter((problem) => {
            const title = problem.title || "";
            const id = problem.id || "";
            const matchesSearch =
                title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                id.toString().includes(searchQuery);

            let matchesCategory = true;
            if (activeTab !== "All") {
                const type = problem.type || "";
                matchesCategory =
                    type.toLowerCase() === activeTab.toLowerCase() ||
                    title.toLowerCase().includes(activeTab.toLowerCase());
            }

            return matchesSearch && matchesCategory;
        });
    }, [problems, searchQuery, activeTab]);

    return (
        <div className="animate-in fade-in duration-1000">
            {/* UPDATED ROW-WISE UI HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                <div className="space-y-2">
                    <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Neural Registry Platform</p>
                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter leading-none flex items-center gap-3">
                        <Code2 className="w-8 h-8 text-primary" />
                        Logic <span className="text-primary italic">Architecture</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-base max-w-xl">
                        A high-performance environment for technical evaluation and algorithmic precision.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-6 h-12 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all w-full shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* CATEGORIES SECTION */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-center gap-2 px-4 border-r border-gray-200 mr-2">
                    <ListFilter className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter</span>
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={cn(
                            "px-5 py-2 rounded-xl border text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap",
                            activeTab === cat
                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                                : "bg-white border-gray-200 text-gray-500 hover:border-primary/40 hover:text-primary shadow-sm"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ACTUAL ROW-WISE UI (TABLE) */}
            <div className="bg-background overflow-hidden border border-gray-800/60 group/table">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-800/80 bg-gray-900/40">
                                <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center w-20">Status</th>
                                <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500">Problem Module</th>
                                <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center">Solve Plus</th>
                                {/* <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center">YT Plus</th>
                                <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center">Resources</th> */}
                                <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center">Activity</th>
                                {/* <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center">Note</th> */}
                                <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center">Like</th>
                                <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 text-right pr-12">Difficulty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/40">
                            {filteredProblems.map((problem, idx) => (
                                <tr
                                    key={problem.id}
                                    className="group/row hover:bg-white/[0.02] transition-all duration-300"
                                >
                                    <td className="px-8 py-8 text-center">
                                        <div className="flex justify-center">
                                            {problem.solved ? (
                                                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-lg border-2 border-gray-800 group-hover/row:border-gray-700 transition-all flex items-center justify-center bg-gray-900/50">
                                                    <Circle className="w-1.5 h-1.5 text-transparent" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col">
                                            <Link href={`/dashboard/programming/${problem.id}`} className="group/title">
                                                <span className="text-gray-500 font-bold text-lg group-hover/title:text-primary transition-colors tracking-tight leading-tight block">
                                                    {problem.title}
                                                </span>
                                            </Link>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                
                                                {problem.type && (
                                                    <span className="text-[9px] font-black text-primary/70 uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                                        {problem.type}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <Link 
                                            href={`/dashboard/programming/${problem.id}`} 
                                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            Solve
                                        </Link>
                                    </td>
                                    {/* <td className="px-8 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center group/icon hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all cursor-pointer border border-orange-500/20">
                                                <Youtube className="w-5 h-5 text-orange-500 group-hover/icon:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className="flex items-center justify-center gap-5">
                                            <div className="p-2.5 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer group/sub">
                                                <FileText className="w-5 h-5 text-gray-600 group-hover/sub:text-gray-300 transition-colors" />
                                            </div>
                                            <div className="p-2.5 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer group/sub">
                                                <Youtube className="w-5 h-5 text-[#ef4444] group-hover/sub:text-red-400 transition-colors" />
                                            </div>
                                        </div>
                                    </td> */}
                                    <td className="px-8 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center  border border-gray-800/40 opacity-40 group-hover/row:opacity-100 group-hover/row:border-primary/30 group-hover/row:bg-primary/5 transition-all">
                                                <Activity className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td className="px-8 py-8 text-center">
                                        <div className="flex justify-center">
                                            <button className="p-2.5 rounded-full bg-gray-900/50 border border-gray-800 hover:border-gray-600 hover:bg-gray-800 transition-all text-gray-500 hover:text-gray-200">
                                                <PlusCircle className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </td> */}
                                    <td className="px-8 py-8 text-center">
                                        <div className="flex justify-center">
                                            <button className="p-2.5 rounded-full hover:bg-amber-500/10 group/star transition-all">
                                                <Star className="w-5 h-5 text-gray-800 group-hover/star:text-amber-500 group-hover/star:fill-amber-500 transition-all" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right pr-12">
                                        <Badge
                                            className={cn(
                                                "rounded-xl text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2 border shadow-none transition-all duration-500",
                                                problem.difficulty === "Easy"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover/row:bg-emerald-500 group-hover/row:text-white group-hover/row:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                    : problem.difficulty === "Medium"
                                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover/row:bg-amber-500 group-hover/row:text-white group-hover/row:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                                                        : "bg-rose-500/10 text-rose-500 border-rose-500/20 group-hover/row:bg-rose-500 group-hover/row:text-white group-hover/row:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                                            )}
                                        >
                                            {problem.difficulty}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProblems.length === 0 && (
                    <div className="py-48 text-center bg-background border-t border-gray-800/40">
                        <div className="relative inline-block mb-8">
                            <Code2 className="w-20 h-20 text-gray-800 opacity-20" />
                            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
                        </div>
                        <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-[11px] max-w-xs mx-auto leading-loose">
                            NO DATA SEGMENTS FOUND IN CURRENT <span className="text-primary">CORE REGISTRY</span>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
