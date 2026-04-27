'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Building2, BookOpen, Clock, AlertCircle, PlayCircle, BarChart3 } from 'lucide-react';
import { PageHeader } from "@/components/dashboard/page-header";
import { motion } from "framer-motion";
import { Loader } from "@/components/ui/loader";

interface AssignedTest {
  id: string;
  test: {
    id: string;
    title: string;
    description: string;
    type: string;
    company: string | null;
    topic: string | null;
    difficulty: string;
    duration: number;
    questionCount?: number;
  };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function MyTestsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<AssignedTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedTests();
  }, []);

  const fetchAssignedTests = async () => {
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error('Error fetching assigned tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId: string) => {
    router.push(`/dashboard/test/${testId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader text="Loading Assignments..." />
      </div>
    );
  }

  const companyTests = assignments.filter(a => a.test.type === 'company');
  const topicTests = assignments.filter(a => a.test.type === 'topic');

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      <motion.div variants={item}>
        <PageHeader
          title="My Tests"
          description="Tests assigned to you by your instructors"
        />
      </motion.div>

      {assignments.length === 0 && (
        <motion.div variants={item}>
          <Card className="p-12 text-center border-dashed border-gray-200 bg-gray-50/50">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <AlertCircle className="h-12 w-12 text-gray-300" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">No Tests Assigned</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You don&apos;t have any tests assigned yet. Check back later or contact your instructor.
            </p>
          </Card>
        </motion.div>
      )}

      {companyTests.length > 0 && (
        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Building2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">Corporate Challenges</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Industry standard assessments</p>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#0d0f14] shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Assessment</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Category</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Metrics</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {companyTests.map(({ test }) => (
                    <motion.tr
                      key={test.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      className="group transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                            {test.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{test.description}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-none font-black uppercase tracking-widest text-[9px]">
                          {test.company}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Time</span>
                            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-emerald-500" /> {test.duration}m
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Rank</span>
                            <Badge className="h-4 text-[8px] font-black uppercase tracking-tighter bg-white/5 text-gray-400 border-none">
                              {test.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                          onClick={() => handleStartTest(test.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-10 shadow-lg shadow-emerald-900/20 border border-emerald-400/20 active:scale-95"
                        >
                          Execute <PlayCircle className="ml-2 w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {topicTests.length > 0 && (
        <motion.div variants={item} className="space-y-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
              <BookOpen className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">Module Mastery</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Focused skill synchronization</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#0d0f14] shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Module</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Focus</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Metrics</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topicTests.map(({ test }) => (
                    <motion.tr
                      key={test.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      className="group transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                            {test.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{test.description}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-none font-black uppercase tracking-widest text-[9px]">
                          {test.topic}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Time</span>
                            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-cyan-500" /> {test.duration}m
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Rank</span>
                            <Badge className="h-4 text-[8px] font-black uppercase tracking-tighter bg-white/5 text-gray-400 border-none">
                              {test.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                          onClick={() => handleStartTest(test.id)}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-10 shadow-lg shadow-cyan-900/20 border border-cyan-400/20 active:scale-95"
                        >
                          Initialize <PlayCircle className="ml-2 w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
