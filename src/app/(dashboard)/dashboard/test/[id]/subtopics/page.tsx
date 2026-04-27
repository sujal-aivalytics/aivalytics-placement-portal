'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/loader";
import { BookOpen, CheckCircle2, Clock, ArrowLeft, Trophy } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { motion } from "framer-motion";
import { parseJsonSafely } from "@/lib/fetch-utils";

interface Subtopic {
  id: string;
  name: string;
  description?: string;
  totalQuestions: number;
  progress: {
    score: number;
    total: number;
    percentage: number;
    completed: boolean;
    attempted: boolean;
  } | null;
}

interface Test {
  id: string;
  title: string;
  description?: string;
  duration: number;
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

export default function SubtopicsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [testId, setTestId] = useState<string>('');
  const [test, setTest] = useState<Test | null>(null);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setTestId(id);
      // Fetch test details
      fetch(`/api/tests?id=${id}`)
        .then(parseJsonSafely)
        .then(data => {
          if (data.test) {
            setTest(data.test);
          }
        })
        .catch(err => console.error('Failed to fetch test:', err));

      // Fetch subtopics
      fetch(`/api/tests/${id}/subtopics`)
        .then(parseJsonSafely)
        .then(data => {
          if (data.subtopics) {
            setSubtopics(data.subtopics);
          }
        })
        .catch(err => console.error('Failed to fetch subtopics:', err))
        .finally(() => setLoading(false));
    });
  }, [params]);

  const getStatusBadge = (subtopic: Subtopic) => {
    if (subtopic.progress?.completed) {
      return (
        <Badge className="bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase tracking-wider text-[10px] px-4 py-2 shadow-lg">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} />
          Completed
        </Badge>
      );
    }
    if (subtopic.progress?.attempted) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-none font-black uppercase tracking-wider text-[10px] px-4 py-2 shadow-lg">
          <Clock className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} />
          In Progress
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-2 border-gray-300 text-gray-600 rounded-none font-black uppercase tracking-wider text-[10px] px-4 py-2">
        Not Started
      </Badge>
    );
  };

  const completedCount = subtopics.filter(s => s.progress?.completed).length;
  const totalSubtopics = subtopics.length;
  const overallProgress = totalSubtopics > 0 ? (completedCount / totalSubtopics) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Spinner size={40} className="text-emerald-600" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <motion.div variants={item}>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/topics')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Button>
        </div>

        <PageHeader
          title={test?.title || 'Select Subtopic'}
          description={test?.description || 'Choose a subtopic to practice'}
        />

        {/* Overall Progress Card */}
        {totalSubtopics > 0 && (
          <Card className="mt-6 border-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-none shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-none bg-primary/10 flex items-center justify-center border-4 border-primary/20 shadow-lg">
                    <Trophy className="w-8 h-8 text-primary" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl tracking-tight">Overall Progress</h3>
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      {completedCount} of {totalSubtopics} subtopics completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-primary">
                    {Math.round(overallProgress)}%
                  </div>
                </div>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-none overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {subtopics.length === 0 ? (
        <motion.div variants={item} className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 backdrop-blur-sm">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-white text-lg">No Subtopics Found</h3>
          <p className="text-gray-400">This topic doesn't have any subtopics yet.</p>
          <Button
            onClick={() => router.push(`/dashboard/test/${testId}`)}
            className="mt-6 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20"
          >
            Take Full Test Instead
          </Button>
        </motion.div>
      ) : (
        <motion.div variants={item} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 w-24">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Module / Topic</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 w-40">Performance</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 w-32">Questions</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 w-32 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subtopics.map((subtopic) => (
                  <motion.tr
                    key={subtopic.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                    className="group transition-colors relative"
                  >
                    {/* Status Column */}
                    <td className="px-6 py-6 align-middle">
                      {subtopic.progress?.completed ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : subtopic.progress?.attempted ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 animate-pulse">
                          <Clock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        </div>
                      )}
                    </td>

                    {/* Module Column */}
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                            {subtopic.name}
                          </h4>
                          {subtopic.progress?.completed && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px] uppercase tracking-wider h-4 px-1.5">Mastered</Badge>
                          )}
                        </div>
                        {subtopic.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 font-medium max-w-md">
                            {subtopic.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Progress Column */}
                    <td className="px-6 py-6">
                      {subtopic.progress ? (
                        <div className="space-y-2 max-w-[140px]">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                            <span className="text-gray-500">Score</span>
                            <span className={subtopic.progress.percentage >= 80 ? 'text-emerald-400' : 'text-cyan-400'}>
                              {Math.round(subtopic.progress.percentage)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${subtopic.progress.percentage}%` }}
                              className={`h-full rounded-full ${
                                subtopic.progress.percentage >= 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                              }`}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-600">Pending</span>
                      )}
                    </td>

                    {/* Questions Column */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold">{subtopic.totalQuestions} Problems</span>
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-6 text-right">
                      <Button
                        onClick={() => router.push(`/dashboard/test/${testId}/subtopic/${subtopic.id}`)}
                        size="sm"
                        className={`rounded-xl px-6 font-black text-[10px] uppercase tracking-widest h-9 transition-all active:scale-95 ${
                          subtopic.progress?.completed
                            ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 border border-cyan-400/20'
                        }`}
                      >
                        {subtopic.progress?.completed ? 'Revision' : 'Solve +'}
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Summary Button */}
      {completedCount >= 1 && totalSubtopics > 0 && (
        <motion.div variants={item} className="flex justify-center pt-10">
          <Button
            onClick={() => router.push(`/dashboard/test/${testId}/summary`)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-2xl shadow-emerald-900/20 px-12 py-7 text-sm font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 active:translate-y-0"
          >
            <Trophy className="w-5 h-5 mr-3" />
            Claim Topic Certification
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
