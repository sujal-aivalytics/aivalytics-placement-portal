import { adminDb } from "@/lib/firebase-config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code2, ChevronRight, Timer, Layers, Trophy, BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import * as motion from "framer-motion/client";

export default async function ProgrammingProblemsPage() {
  const session = await getServerSession(authOptions);

  // Fetch all problems
  const snapshot = await adminDb.collection("Problem").orderBy("createdAt", "desc").get();
  const problems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1 font-bold uppercase tracking-widest text-[10px]">Registry</Badge>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Programming <span className="text-indigo-600 italic">Practice</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
            Master your coding skills with curated challenges spanning data structures, algorithms, and system design.
          </p>
        </motion.div>

        {problems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm"
          >
            <div className="p-6 bg-slate-50 rounded-full mb-6">
              <BookOpen className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Computational Void</h3>
            <p className="text-slate-500 mb-8 max-w-sm text-center font-medium">No challenges have been added to the registry yet. Check back soon for fresh modules.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {problems.map((problem) => (
              <motion.div key={problem.id} variants={item}>
                <Card className="group relative border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden rounded-[2.5rem] h-full flex flex-col">
                  {/* Decorative Gradient */}
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${problem.difficulty === 'Easy' ? 'from-emerald-400 to-teal-500' :
                      problem.difficulty === 'Medium' ? 'from-amber-400 to-orange-500' :
                        'from-rose-500 to-pink-600'
                    }`} />

                  <CardContent className="p-8 flex flex-col h-full pt-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-2xl ${problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                          problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                        }`}>
                        <Trophy className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className={`font-bold uppercase tracking-widest text-[9px] px-3 py-1 ${problem.difficulty === 'Easy' ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' :
                          problem.difficulty === 'Medium' ? 'text-amber-600 border-amber-100 bg-amber-50/30' :
                            'text-rose-600 border-rose-100 bg-rose-50/30'
                        }`}>
                        {problem.difficulty}
                      </Badge>
                    </div>

                    <div className="mb-6 flex-1">
                      <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                        {problem.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> {problem.expectedTime || '45m'}</span>
                        <span className="px-2 text-slate-200">|</span>
                        <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {problem.expectedSpace || 'O(n)'}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 mt-auto">
                      <Link href={`/dashboard/programming/${problem.id}`} className="block">
                        <Button className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] group/btn transition-all active:scale-[0.98] shadow-xl shadow-slate-200/50">
                          Solve Challenge
                          <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
