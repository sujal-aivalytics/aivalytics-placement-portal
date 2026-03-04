"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ListFilter, Circle, Trophy, Code2, ChevronRight } from "lucide-react";
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
            // 1. Search Filter
            const matchesSearch =
                problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                problem.id.toString().includes(searchQuery);

            // 2. Category Filter
            let matchesCategory = true;
            if (activeTab !== "All") {
                const type = problem.type || "";
                matchesCategory =
                    type.toLowerCase() === activeTab.toLowerCase() ||
                    problem.title.toLowerCase().includes(activeTab.toLowerCase());
            }

            return matchesSearch && matchesCategory;
        });
    }, [problems, searchQuery, activeTab]);

    return (
        <div className="animate-in fade-in duration-1000">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="space-y-4">
                    <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Development Environment</p>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none flex items-center gap-4">
                        <Code2 className="w-10 h-10 text-primary" />
                        Engineering <span className="text-primary italic">Registry</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg max-w-xl">
                        A centralized database of logic challenges designed to audit architectural thinking and algorithmic precision.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="QUERY DATABASE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-6 h-14 bg-white border border-gray-100 rounded-none text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all w-full shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* CATEGORIES SECTION */}
            <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide border-b border-gray-100">
                <div className="flex items-center gap-2 px-6 border-r border-gray-100 mr-4">
                    <ListFilter className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modules</span>
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={cn(
                            "px-8 py-3 rounded-none border text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap",
                            activeTab === cat
                                ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/10"
                                : "bg-white border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* PROBLEMS TABLE */}
            <div className="bg-white border-0 rounded-none shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden aivalytics-card">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-10 py-6 font-black text-[10px] uppercase tracking-widest text-gray-400 w-24 text-center">
                                Status
                            </th>
                            <th className="px-10 py-6 font-black text-[10px] uppercase tracking-widest text-gray-400">
                                Challenge Index
                            </th>
                            <th className="px-10 py-6 font-black text-[10px] uppercase tracking-widest text-gray-400 w-44">
                                Audit Difficulty
                            </th>
                            <th className="px-10 py-6 w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProblems.map((problem) => (
                            <tr
                                key={problem.id}
                                className="group hover:bg-slate-50 transition-all relative"
                            >
                                <td className="px-10 py-8 text-center">
                                   <div className="w-8 h-8 rounded-none bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto transition-all group-hover:bg-primary/5 group-hover:border-primary/20">
                                        <Circle
                                            className="text-gray-200 group-hover:text-primary transition-colors"
                                            size={12}
                                            strokeWidth={3}
                                        />
                                   </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex flex-col">
                                        <Link
                                            href={`/dashboard/programming/${problem.id}`}
                                            className="font-black text-xl text-gray-900 tracking-tight group-hover:text-primary transition-colors flex items-center gap-4 after:absolute after:inset-0"
                                        >
                                            <span className="text-gray-300 font-black text-[10px] uppercase tracking-widest pt-1">
                                                ID: {problem.id}
                                            </span>
                                            {problem.title}
                                        </Link>
                                        <div className="flex gap-3 mt-3">
                                            {problem.type && (
                                                <Badge className="rounded-none bg-gray-50 text-gray-400 border border-gray-100 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 shadow-none">
                                                    {problem.type}
                                                </Badge>
                                            )}
                                            <Badge className="rounded-none bg-primary/5 text-primary border border-primary/10 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 shadow-none">
                                                Active Environment
                                            </Badge>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <Badge
                                        className={cn(
                                            "rounded-none text-[8px] font-black uppercase tracking-widest px-4 py-1.5 border-0 shadow-sm transition-all duration-500",
                                            problem.difficulty === "Easy"
                                                ? "bg-primary text-white shadow-primary/20"
                                                : problem.difficulty === "Medium"
                                                    ? "bg-amber-400 text-white shadow-amber-400/20"
                                                    : "bg-gray-900 text-white shadow-gray-900/20"
                                        )}
                                    >
                                        {problem.difficulty}
                                    </Badge>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProblems.length === 0 && (
                    <div className="py-40 text-center bg-gray-50/20">
                        <Trophy className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                        <p className="text-gray-300 font-black uppercase tracking-[0.2em] text-sm italic">
                            No records matched your search parameters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
