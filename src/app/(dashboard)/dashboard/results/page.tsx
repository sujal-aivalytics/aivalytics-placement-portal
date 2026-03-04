'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

import {
  Trophy,
  Calendar,
  Target,
  Award,
  ArrowUpRight,
  AlertTriangle
} from "lucide-react";
import { getMonitoringEvents } from "@/app/actions/monitoring";

/* ---------------- animations ---------------- */

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

/* ---------------- types ---------------- */

interface ResultData {
  id: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: string;
  test: {
    title: string;
    type: string;
    difficulty: string;
  };
}

/* ---------------- page ---------------- */

export default function ResultsHistoryPage() {
  const router = useRouter();
  const [results, setResults] = useState<ResultData[]>([]);
  const [loading, setLoading] = useState(true);


  const [violations, setViolations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, events] = await Promise.all([
          fetch("/api/results"),
          getMonitoringEvents()
        ]);

        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
        setViolations(events);

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20 animate-in fade-in duration-1000"
    >
      {/* ---------- Header ---------- */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
           <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Academic Records</p>
           <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none">Assessment <span className="text-primary italic">Analytics</span></h1>
           <p className="text-gray-500 font-medium text-lg mt-4 max-w-2xl">A comprehensive historical registry of your performance across all modules and simulations.</p>
        </div>
        <Button
          variant="outline"
          className="h-14 px-8 rounded-none border-gray-100 bg-white hover:bg-slate-50 text-gray-400 font-black uppercase tracking-widest text-[10px] shadow-sm transition-all gap-3"
        >
          <ArrowUpRight className="w-4 h-4 text-primary" />
          Export Dossier
        </Button>
      </motion.div>

      {/* ---------- Table ---------- */}
      <motion.div variants={item}>
        <Card className="rounded-none border-0 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden bg-white aivalytics-card group">
          <CardHeader className="p-10 border-b border-gray-50 flex flex-row items-center justify-between">
            <div>
              <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-1">Performance Overview</p>
              <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">Recent Audits</CardTitle>
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Total Recorded: <span className="text-gray-900 font-black">{results.length}</span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-50">
                  <TableHead className="px-10 py-6 text-[10px] items-center font-black uppercase tracking-widest text-gray-400">Module</TableHead>
                  <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Classification</TableHead>
                  <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</TableHead>
                  <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Score</TableHead>
                  <TableHead className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {results.map((result) => (
                  <TableRow
                    key={result.id}
                    onClick={() =>
                      router.push(`/dashboard/results/${result.id}`)
                    }
                    className="cursor-pointer group hover:bg-slate-50 border-gray-50 transition-colors"
                  >
                    <TableCell className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-none bg-primary/5 text-primary flex items-center justify-center border border-primary/10 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <Award className="w-6 h-6" />
                        </div>
                        <span className="font-black text-gray-900 text-lg tracking-tight group-hover:text-primary transition-colors">{result.test.title}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="rounded-none border-gray-100 text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 text-gray-400">
                        {result.test.type}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Calendar className="inline w-3 h-3 mr-2 text-primary/40" />
                      {new Date(result.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>

                    <TableCell className="font-black text-xl text-gray-900 tracking-tighter">
                      {result.score} <span className="text-gray-300 text-xs font-bold">/ {result.total}</span>
                    </TableCell>

                    <TableCell className="px-10 py-8 text-right">
                      <Badge
                        className={cn(
                          "rounded-none font-black uppercase tracking-widest text-[8px] px-4 py-2 border-0 shadow-lg",
                          result.percentage >= 75
                            ? "bg-primary text-white shadow-primary/20"
                            : result.percentage >= 50
                              ? "bg-amber-400 text-white shadow-amber-400/20"
                              : "bg-gray-900 text-white shadow-gray-900/20"
                        )}
                      >
                        {result.percentage >= 75
                          ? "Distinction"
                          : result.percentage >= 50
                            ? "Proficiency"
                            : "Developing"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && results.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-32 bg-gray-50/50"
                    >
                       <p className="text-gray-300 font-black uppercase tracking-[0.2em] text-sm italic">Assessment records not found.</p>
                       <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2">Historical data will populate here after test completion.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------- Violations Table ---------- */}
      <motion.div variants={item}>
        <Card className="rounded-none border-0 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden bg-white aivalytics-card group relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20" />
          <CardHeader className="p-10 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Security Incident Logs</p>
                <CardTitle className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Proctoring Anomalies
                </CardTitle>
              </div>
              <Badge className="bg-red-50 text-red-500 border border-red-100 rounded-none font-black uppercase tracking-widest text-[8px] px-4 py-2">Restricted Registry</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-50">
                  <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Target Session</TableHead>
                  <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Anomaly Classification</TableHead>
                  <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Log Details</TableHead>
                  <TableHead className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Incident Timestamp</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {violations.map((v) => (
                  <TableRow key={v.id} className="hover:bg-red-50/5 border-gray-50 transition-colors">
                    <TableCell className="px-10 py-8 font-black text-gray-900 tracking-tight">{v.testType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-none border-red-100 text-red-600 bg-red-50 font-black uppercase tracking-widest text-[8px] px-3 py-1">
                        {v.violationType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-sm">
                      {v.details}
                    </TableCell>
                    <TableCell className="px-10 py-8 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(v.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && violations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 bg-gray-50/20">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-none bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                          <Target className="w-8 h-8" />
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Registry Clean: Zero Anomalies Detected.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
