"use client";

import { useState, useEffect, use } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
    ChevronLeft, 
    Plus, 
    BookOpen, 
    FileText, 
    ArrowRight, 
    Settings,
    MoreVertical,
    FileEdit,
    Trash2,
    Calendar,
    Layout,
    GraduationCap
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { Spinner } from "@/components/ui/loader";
import { motion, AnimatePresence } from 'framer-motion';

interface Test {
    id: string;
    title: string;
    type: string;
    duration: number;
    difficulty: string;
    company?: string;
    topic?: string;
    createdAt?: any;
    updatedAt?: any;
}

interface Subtopic {
    id: string;
    name: string;
    description?: string;
    order: number;
    roundTitle?: string;
    type?: string;
    totalQuestions: number;
}

export default function AdminTestDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const paramsResolved = use(params);
    const id = paramsResolved.id;
    const router = useRouter();
    const [test, setTest] = useState<Test | null>(null);
    const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch test details
            const testRes = await fetch(`/api/tests?id=${id}`);
            if (testRes.ok) {
                const testData = await testRes.json();
                setTest(testData.test || null);
            }

            // Fetch subtopics
            const subtopicsRes = await fetch(`/api/tests/${id}/subtopics`);
            if (subtopicsRes.ok) {
                const subtopicsData = await subtopicsRes.json();
                setSubtopics(subtopicsData.subtopics || []);
            }
        } catch (error) {
            console.error('Failed to fetch test data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size={48} className="text-[#00B4A0]" />
            </div>
        );
    }

    if (!test) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Test not found</h1>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/admin/tests">Back to All Tests</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto">
            {/* Breadcrumbs / Back */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/admin/tests" className="hover:text-primary flex items-center transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Curriculum Management
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium truncate">{test.title}</span>
            </nav>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#00B4A0]/10 rounded-2xl">
                            <Layout className="w-8 h-8 text-[#00B4A0]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-[#1A1A2E]">{test.title}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 px-3">
                                    {test.type === 'company' ? `Company: ${test.company}` : `Topic: ${test.topic}`}
                                </Badge>
                                <Badge className="bg-[#00B4A0] hover:bg-[#00B4A0]/90 capitalize">
                                    {test.difficulty}
                                </Badge>
                                <span className="text-gray-400 text-sm flex items-center">
                                    <Calendar className="w-3.5 h-3.5 mr-1" />
                                    Updated recently
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-12 px-6 font-bold border-gray-200 hover:bg-gray-50 transition-all">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Settings
                    </Button>
                    <Button asChild className="rounded-none h-12 px-8 font-extrabold bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white shadow-xl shadow-gray-200 transition-all">
                        <Link href="/admin/subtopics">
                            Go to Resource Bank
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Curriculum Breakdown */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Subtopics / Curriculum Structure */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-[#1A1A2E] flex items-center gap-2">
                            Curriculum Structure
                            <span className="text-sm font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md ml-2">
                                {subtopics.length} Sections
                            </span>
                        </h2>
                        <Button size="sm" variant="ghost" className="text-[#00B4A0] hover:text-[#00B4A0] hover:bg-[#00B4A0]/5 font-bold" asChild>
                            <Link href={`/admin/subtopics?testId=${id}`}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add Section
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {subtopics.length === 0 ? (
                                <Card className="border-dashed border-2 bg-gray-50/50 shadow-none">
                                    <CardContent className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <BookOpen className="w-12 h-12 text-gray-300" />
                                            <div>
                                                <p className="text-gray-900 font-bold">No sections defined yet</p>
                                                <p className="text-gray-500 text-sm mt-1">Start building your curriculum by adding sections in the Resource Bank.</p>
                                            </div>
                      <Button asChild className="bg-[#00B4A0] hover:bg-[#00B4A0]/90 mt-2">
                                                <Link href={`/admin/subtopics?testId=${id}`}>Build Curriculum</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                subtopics.map((subtopic, index) => (
                                    <motion.div
                                        key={subtopic.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="group hover:shadow-2xl hover:shadow-primary/5 border-gray-100 transition-all duration-500 overflow-hidden rounded-xl">
                                            <div className="flex items-stretch h-full">
                                                {/* Left Accent */}
                                                <div className="w-1.5 bg-gray-100 group-hover:bg-[#00B4A0] transition-colors duration-500" />
                                                
                                                <div className="flex-1 p-6 flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-black text-[#00B4A0]/40 uppercase tracking-widest">Section {index + 1}</span>
                                                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none text-[10px] uppercase font-bold">
                                                                {subtopic.type || 'Normal'}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00B4A0] transition-colors">{subtopic.name}</h3>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{subtopic.description || 'No description provided.'}</p>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="hidden md:flex flex-col items-end pr-4 border-r border-gray-100">
                                                            <span className="text-xl font-black text-gray-900">{subtopic.totalQuestions}</span>
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">MCQs Banked</span>
                                                        </div>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="rounded-full hover:bg-[#00B4A0] hover:text-white transition-all text-gray-400"
                                                            asChild
                                                        >
                                                            <Link href={`/admin/subtopics?testId=${id}&subtopicId=${subtopic.id}`}>
                                                                <FileEdit className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar Stats / Info */}
                <div className="space-y-6">
                    <Card className="bg-[#1A1A2E] text-white border-none shadow-2xl shadow-blue-900/20 rounded-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <GraduationCap className="w-32 h-32" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase tracking-wider text-[#00B4A0]">Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Duration</p>
                                    <p className="text-2xl font-bold">{test.duration} <span className="text-sm font-medium text-gray-400">min</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Questions</p>
                                    <p className="text-2xl font-bold">{subtopics.reduce((acc, s) => acc + s.totalQuestions, 0)}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-medium">Difficulty Level</span>
                                    <span className="font-bold text-[#00B4A0]">{test.difficulty}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-medium">Auto-Grading</span>
                                    <span className="font-bold text-green-400">Enabled</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-gray-100 shadow-xl shadow-gray-100/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start font-bold border-gray-100 hover:border-[#00B4A0]/30 hover:bg-[#00B4A0]/5 transition-all text-gray-600 h-11" asChild>
                                <Link href="/admin/mcq-generator">
                                    <FileText className="w-4 h-4 mr-3 text-[#00B4A0]" />
                                    Generate via AI
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start font-bold border-gray-100 hover:border-[#00B4A0]/30 hover:bg-[#00B4A0]/5 transition-all text-gray-600 h-11">
                                <Settings className="w-4 h-4 mr-3 text-blue-500" />
                                Advanced Config
                            </Button>
                            <Button variant="outline" className="w-full justify-start font-bold border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-gray-600 h-11">
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete Curriculum
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
