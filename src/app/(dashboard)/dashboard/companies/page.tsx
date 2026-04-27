'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/loader";
import { Clock, CheckCircle2, FileText, Code2, AlertCircle, PlayCircle, Lock, Building2 } from 'lucide-react';
import { PageHeader } from "@/components/dashboard/page-header";

// Mock Data for immediate visualization (if API empty)
const MOCK_TCS_TESTS = [
  {
    id: 'tcs-foundation',
    title: 'TCS Foundation Test',
    description: 'Numerical, Verbal & Reasoning Ability',
    questions: 65,
    duration: 90,
    company: 'TCS',
    type: 'company'
  },
  {
    id: 'tcs-advanced',
    title: 'TCS Advanced Test',
    description: 'Quantitative & Logical Reasoning',
    questions: 15,
    duration: 45,
    company: 'TCS',
    type: 'company'
  },
  {
    id: 'tcs-coding',
    title: 'TCS Coding Test',
    description: 'Programming & Problem Solving',
    questions: 3,
    duration: 90,
    company: 'TCS',
    type: 'company'
  }
];

const MOCK_WIPRO_TESTS = [
  {
    id: 'wipro-aptitude',
    title: 'Wipro Aptitude Test',
    description: 'Quant, Logical & Verbal Ability',
    questions: 50,
    duration: 60,
    company: 'Wipro',
    type: 'company'
  },
  {
    id: 'wipro-essay',
    title: 'Wipro Essay Writing',
    description: 'Written Communication Skills',
    questions: 1,
    duration: 30,
    company: 'Wipro',
    type: 'company'
  },
  {
    id: 'wipro-coding',
    title: 'Wipro Coding Test',
    description: 'Programming Challenges',
    questions: 2,
    duration: 60,
    company: 'Wipro',
    type: 'company'
  }
];

export default function CompanyTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We try to fetch real data, if empty we use mock to ensure UI shows up
    const fetchTests = async () => {
      try {
        const res = await fetch('/api/tests?type=company');
        const data = await res.json();
        if (data.tests && data.tests.length > 0) {
          setTests(data.tests);
        } else {
          // Fallback to mock data for demonstration
          setTests([...MOCK_TCS_TESTS, ...MOCK_WIPRO_TESTS]);
        }
      } catch (error) {
        console.error("Failed to fetch tests", error);
        setTests([...MOCK_TCS_TESTS, ...MOCK_WIPRO_TESTS]);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Spinner size={40} className="text-emerald-600" />
      </div>
    );
  }

  const tcsTests = tests.filter(t => t.company === 'TCS' || t.title.includes('TCS'));
  const wiproTests = tests.filter(t => t.company === 'Wipro' || t.title.includes('Wipro'));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-12"
    >

      {/* Page Items */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Company Specific Tests</h1>
        <p className="text-gray-500">Practice with company-specific placement tests and assessments</p>
      </div>

      {/* Banner Info */}
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-start gap-4">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <Badge className="bg-emerald-600 hover:bg-emerald-700 h-6 w-6 rounded-full p-0 flex items-center justify-center">i</Badge>
        </div>
        <div>
          <h3 className="font-bold text-emerald-900 mb-1">About Placement Tests</h3>
          <p className="text-sm text-emerald-700 mb-4">These tests simulate actual company placement assessments. Practice as many times as you want to improve your skills.</p>
          <div className="flex gap-6 text-sm text-emerald-600 font-medium">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Timed tests to simulate pressure</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Comprehensive result analysis</span>
          </div>
        </div>
      </div>

      {/* TCS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-l-4 border-[#0067b1] pl-4">
          <div className="w-12 h-12 relative overflow-hidden rounded-none bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <Building2 className="w-8 h-8 text-[#0067b1]" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">TCS <span className="text-[#0067b1] italic">Recruitment Drive</span></h2>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-none aivalytics-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Assessment Module</th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tcsTests.map((test) => (
                  <motion.tr 
                    key={test.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group hover:bg-slate-50 transition-all duration-300"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-none flex items-center justify-center bg-gray-50 border border-gray-100 group-hover:bg-[#0067b1] group-hover:text-white transition-all duration-500 shadow-inner">
                          {test.title.includes('Coding') ? <Code2 className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-lg group-hover:text-[#0067b1] transition-colors tracking-tight">{test.title}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 line-clamp-1">{test.description || 'Institutional placement simulation.'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-8">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-none border border-gray-100 w-fit">
                        <Clock className="w-3.5 h-3.5 text-[#0067b1]/40" /> {test.duration} MINS
                      </div>
                    </td>

                    <td className="py-8">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span className="text-gray-900 text-sm">{test.questions || test._count?.questions}</span> Modules
                      </div>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <Link href={`/dashboard/test/${test.id}`}>
                        <Button className="rounded-none font-black uppercase tracking-widest text-[9px] px-8 py-3 bg-[#0067b1] hover:bg-[#004d80] text-white border-0 shadow-lg shadow-blue-900/10 transition-all duration-300 hover:-translate-y-0.5">
                          Initialize
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* WIPRO SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-l-4 border-[#E63312] pl-4">
          <div className="w-12 h-12 relative overflow-hidden rounded-none bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <Building2 className="w-8 h-8 text-[#E63312]" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Wipro <span className="text-[#E63312] italic">NTH Drive</span></h2>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-none aivalytics-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Assessment Module</th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {wiproTests.map((test) => (
                  <motion.tr 
                    key={test.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group hover:bg-slate-50 transition-all duration-300"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-none flex items-center justify-center bg-gray-50 border border-gray-100 group-hover:bg-[#E63312] group-hover:text-white transition-all duration-500 shadow-inner">
                          {test.title.includes('Coding') ? <Code2 className="w-7 h-7" /> : <PlayCircle className="w-7 h-7" />}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-lg group-hover:text-[#E63312] transition-colors tracking-tight">{test.title}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 line-clamp-1">{test.description || 'Specialized Wipro NTH assessment.'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-8">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-none border border-gray-100 w-fit">
                        <Clock className="w-3.5 h-3.5 text-[#E63312]/40" /> {test.duration} MINS
                      </div>
                    </td>

                    <td className="py-8">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span className="text-gray-900 text-sm">{test.questions || test._count?.questions}</span> Modules
                      </div>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <Link href={`/dashboard/test/${test.id}`}>
                        <Button className="rounded-none font-black uppercase tracking-widest text-[9px] px-8 py-3 bg-[#E63312] hover:bg-red-700 text-white border-0 shadow-lg shadow-red-900/10 transition-all duration-300 hover:-translate-y-0.5">
                          Initialize
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
