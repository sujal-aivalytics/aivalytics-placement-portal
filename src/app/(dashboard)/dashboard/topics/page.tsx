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
        <motion.div variants={item} className="text-center py-32 bg-white rounded-none border-2 border-dashed border-gray-100 shadow-inner">
          <div className="w-20 h-20 bg-gray-50 rounded-none flex items-center justify-center mx-auto mb-6 shadow-sm">
            <BookOpen className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="font-black text-gray-900 text-xl uppercase tracking-widest">No Modules Identified</h3>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Check back later for new curriculum updates.</p>
        </motion.div>
      ) : (
        <motion.div variants={item} className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tests.map((test) => (
            <Card key={test.id} className="group flex flex-col border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white rounded-none relative h-full aivalytics-card">
              {/* Color Accent */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${getAccentColor(test.title)}`} />

              <CardContent className="p-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-none bg-gray-50 border border-gray-100 flex items-center justify-center shadow-inner group-hover:bg-primary/5 transition-colors duration-500">
                    {getTopicIcon(test.title)}
                  </div>
                  {test.title.toLowerCase().includes('tcs') || test.title.toLowerCase().includes('wipro') ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded-none font-black uppercase tracking-widest text-[8px] px-3 py-1">Premium</Badge>
                  ) : (
                    <div className="w-3 h-3 rounded-none bg-primary ring-4 ring-primary/10" />
                  )}
                </div>

                <div className="mb-8">
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Practice Set</p>
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight leading-none">
                    {test.title}
                  </h3>
                </div>

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <HelpCircle className="w-4 h-4 text-primary/40" />
                    {test._count?.questions || 0} Questions
                  </div>

                  <Link href={`/dashboard/test/${test.id}/subtopics`} className="w-full ml-6">
                    <Button className="w-full bg-gray-900 hover:bg-black text-white rounded-none shadow-xl transition-all font-black uppercase tracking-[0.2em] h-12 text-[10px] hover:-translate-y-1">
                      Assess
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
