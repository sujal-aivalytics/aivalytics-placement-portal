'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Spinner } from "@/components/ui/loader";
import { BookOpen, HelpCircle, Code2, Calculator, BrainCircuit } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { parseJsonSafely } from "@/lib/fetch-utils";

interface Test {
  id: string;
  title: string;
  _count: {
    questions: number;
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

// Helper to deduce icon or logo
const getTopicIcon = (title: string) => {
  const lower = title.toLowerCase();

  // Check for company logos first
  if (lower.includes('tcs')) return <img src="/logos/tcs-1696999494.jpg" alt="TCS" className="w-10 h-10 object-contain" />;
  if (lower.includes('wipro')) return <img src="/logos/Wipro_Secondary-Logo_Color_RGB.png" alt="Wipro" className="w-10 h-10 object-contain" />;
  if (lower.includes('ibm')) return <img src="/logos/IBM.png" alt="IBM" className="w-10 h-10 object-contain" />;
  if (lower.includes('accenture')) return <img src="/logos/acc.png" alt="Accenture" className="w-10 h-10 object-contain" />;

  // Default topic icons
  if (lower.includes('verbal')) return <BookOpen className="w-6 h-6 text-primary" />;
  if (lower.includes('logic') || lower.includes('reasoning')) return <BrainCircuit className="w-6 h-6 text-primary" />;
  if (lower.includes('math') || lower.includes('quant')) return <Calculator className="w-6 h-6 text-primary" />;
  if (lower.includes('code') || lower.includes('program')) return <Code2 className="w-6 h-6 text-primary" />;

  return <BookOpen className="w-6 h-6 text-primary" />;
};

const getAccentColor = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('tcs')) return 'bg-[#0067b1]'; // TCS Blue
  if (lower.includes('wipro')) return 'bg-gradient-to-r from-red-500 via-blue-500 to-green-500'; // Wipro Rainbow
  return 'bg-primary';
}

export default function TopicsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only topic/aptitude tests
    fetch('/api/tests?type=topic')
      .then(parseJsonSafely)
      .then(data => {
        if (data.tests) {
          setTests(data.tests);
        }
      })
      .catch(err => console.error('Failed to fetch tests:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Spinner size={40} className="text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      <motion.div variants={item}>
        <div className="space-y-4">
           <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Analytical Modules</p>
           <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none">Aptitude <span className="text-primary italic">Intelligence</span></h1>
           <p className="text-gray-500 font-medium text-lg mt-4 max-w-2xl">Practice advanced aptitude assessments organized by specific analytical topics and corporate standards.</p>
        </div>
      </motion.div>

      {tests.length === 0 ? (
        <motion.div variants={item} className="text-center py-32 bg-[#0f1115] rounded-[3rem] border border-gray-800/50 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <BookOpen className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="font-black text-gray-200 text-xl uppercase tracking-[0.3em]">Registry Empty</h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-4 max-w-xs mx-auto leading-relaxed">
              No curriculum modules have been synchronized with the core database yet.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={item} className="overflow-hidden rounded-3xl border border-white/5 bg-background shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Module Core</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Complexity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Inventory</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">Synchronization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tests.map((test) => (
                  <motion.tr
                    key={test.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                    className="group transition-all duration-300 relative"
                  >
                    {/* Module Core */}
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className={`absolute -inset-2 rounded-xl opacity-20 blur-lg transition-all duration-500 group-hover:opacity-40 ${getAccentColor(test.title)}`} />
                          <div className="relative w-16 h-16 rounded-xl bg-[#1a1d23] border border-white/10 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 overflow-hidden">
                            {getTopicIcon(test.title)}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-black text-gray-600 tracking-tight group-hover:text-primary transition-colors">
                              {test.title}
                            </h3>
                            {test.title.toLowerCase().includes('tcs') || test.title.toLowerCase().includes('wipro') ? (
                              <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-none font-black uppercase tracking-widest text-[8px] h-4 px-2">Corporate</Badge>
                            ) : null}
                          </div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aptitude & Assessment Registry</p>
                        </div>
                      </div>
                    </td>

                    {/* Complexity */}
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center w-24">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Level</span>
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest">Advanced</span>
                        </div>
                        <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full w-[75%] rounded-full ${getAccentColor(test.title)}`} />
                        </div>
                      </div>
                    </td>

                    {/* Inventory */}
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/20 transition-colors">
                          <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-500 tracking-tighter">{test._count?.questions || 0}</span>
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.1em]">Target Problems</span>
                        </div>
                      </div>
                    </td>

                    {/* Synchronization (Action) */}
                    <td className="px-8 py-8 text-right">
                      <Link href={`/dashboard/test/${test.id}/subtopics`} className="inline-block">
                        <Button className="bg-white/[0.03] hover:bg-primary hover:text-white text-gray-400 border border-white/10 rounded-xl px-8 h-12 transition-all duration-300 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 group-hover:border-primary/50 group-hover:shadow-primary/20">
                          Initialize
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
