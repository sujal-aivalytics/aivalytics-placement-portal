"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  CloudUpload, 
  Copy, 
  ArrowRight,
  Brain,
  FileJson,
  Info,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

interface GeneratedData {
  id: string;
  questions: any[];
  keywords: string[];
  difficulty: string;
  bloomsLevel: string;
  count: number;
  generatedAt: string;
  source?: string;
}

export default function GeneratedDataPage() {
  const [data, setData] = useState<GeneratedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/local-data/generated-mcqs`);
      if (res.ok) {
        const result = await res.json();
        // The API returns { collection: '...', data: { ... } }
        if (result.data && !Array.isArray(result.data)) {
          setData(result.data);
        } else if (Array.isArray(result.data) && result.data.length > 0) {
          setData(result.data[0]); // Handle array if necessary
        } else {
          setData(null);
        }
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch generated data");
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    if (!confirm("Are you sure you want to clear the generated data? This cannot be undone.")) return;
    
    setClearing(true);
    try {
      const res = await fetch(`/api/local-data/generated-mcqs`, {
        method: "DELETE",
      });
      if (res.ok) {
        setData(null);
        toast.success("Generated data cleared");
      } else {
        toast.error("Failed to clear data");
      }
    } catch (error) {
      toast.error("Error clearing data");
    } finally {
      setClearing(false);
    }
  };

  const syncToFirebase = async () => {
    if (!data) return;
    
    setSyncing(true);
    try {
      // 1. Store in Firestore for structured access
      const docRef = await addDoc(collection(db, "generated_mcqs"), {
        ...data,
        syncedAt: serverTimestamp(),
        status: "synced"
      });

      // 2. Store as JSON file in Firebase Storage if requested (as Backup)
      const storageRef = ref(storage, `mcqs/generated-${Date.now()}.json`);
      await uploadString(storageRef, JSON.stringify(data, null, 2), "raw", {
        contentType: "application/json"
      });
      const downloadURL = await getDownloadURL(storageRef);

      toast.success("Successfully synced to Firebase!", {
        description: `Firestore ID: ${docRef.id}`,
        action: {
          label: "View JSON",
          onClick: () => window.open(downloadURL, "_blank")
        }
      });
    } catch (error: any) {
      console.error("Firebase Sync Error:", error);
      toast.error("Failed to sync to Firebase: " + error.message);
    } finally {
      setSyncing(false);
    }
  };

  const copyJSON = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("JSON copied to clipboard");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-xl shadow-indigo-100/50">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900">
                AI Content Repository
              </h1>
              <div className="flex items-center gap-3 mt-1.5">
                <Badge variant="secondary" className="bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100/50 border-indigo-100 backdrop-blur-sm">
                  <Database className="w-3 h-3 mr-1.5" /> Generated MCQ Vault
                </Badge>
                <div className="h-4 w-px bg-slate-200" />
                <p className="text-sm font-medium text-slate-500">
                  Review and sync high-fidelity assessment content
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearData} 
            disabled={!data || clearing}
            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button 
            onClick={syncToFirebase} 
            disabled={!data || syncing} 
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
          >
            {syncing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4 mr-2" />
            )}
            Sync to Firebase
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200"
          >
            <div className="relative">
              <RefreshCw className="w-12 h-12 text-indigo-200 animate-spin" />
              <Brain className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-slate-500 font-medium">Fetching generated data...</p>
          </motion.div>
        ) : data ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="w-5 h-5 opacity-80" />
                    Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                      <p className="text-xs text-indigo-100 uppercase tracking-wider font-bold opacity-70">Questions</p>
                      <p className="text-2xl font-bold">{data.questions?.reduce((acc: number, g: any) => acc + (g.questions?.length || 0), 0) || 0}</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                      <p className="text-xs text-indigo-100 uppercase tracking-wider font-bold opacity-70">Difficulty</p>
                      <p className="text-2xl font-bold capitalize">{data.difficulty}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                      <span className="opacity-80">Topics Detected</span>
                      <span className="font-medium">{data.keywords?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                      <span className="opacity-80">Bloom's Level</span>
                      <span className="font-medium">{data.bloomsLevel}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="opacity-80">Generated</span>
                      <span className="font-medium">{new Date(data.generatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-between group" onClick={copyJSON}>
                    <span className="flex items-center gap-2">
                      <Copy className="w-4 h-4 text-slate-500" />
                      Copy JSON Buffer
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                      View Full Source
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4" />
                  Sync Guide
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Syncing will upload this local buffer to Firestore. Once synced, it will be available in the global question bank for students.
                </p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-6">
              <ScrollArea className="h-[700px] rounded-2xl border-2 border-slate-100 bg-slate-50/30 p-2">
                <div className="p-4 space-y-6">
                  {data.questions?.map((group: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                      <div className="sticky top-0 z-10 py-2 bg-slate-50/80 backdrop-blur-md rounded-lg px-3 flex items-center justify-between">
                        <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                          <Badge className="bg-indigo-600 font-mono">{idx + 1}</Badge>
                          Topic: {group.keyword}
                        </h3>
                        <Badge variant="outline" className="bg-white border-slate-200">
                          {group.questions?.length || 0} Questions
                        </Badge>
                      </div>

                      <div className="grid gap-4 pl-4">
                        {group.questions?.map((q: any, qidx: number) => (
                          <div key={qidx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                              <p className="font-semibold text-slate-800 leading-snug">
                                {q.question}
                              </p>
                              <div className="flex gap-1">
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                  {q.difficulty}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {q.options?.map((opt: any, oidx: number) => (
                                <div 
                                  key={oidx}
                                  className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${
                                    opt.text === q.correct_answer 
                                    ? "bg-green-50 border-green-200 text-green-700 ring-2 ring-green-100 ring-offset-1" 
                                    : "bg-slate-50 border-slate-100 text-slate-600"
                                  }`}
                                >
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                    opt.text === q.correct_answer 
                                    ? "bg-green-600 text-white" 
                                    : "bg-white text-slate-400 border border-slate-200"
                                  }`}>
                                    {opt.label}
                                  </span>
                                  <span className={opt.text === q.correct_answer ? "font-bold" : ""}>
                                    {opt.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            {q.reference_excerpt && (
                              <div className="mt-4 pt-3 border-t border-slate-50 flex items-start gap-2 text-xs text-slate-400 italic">
                                <FileJson className="w-3 h-3 mt-0.5 opacity-50" />
                                <span>Ref: "{q.reference_excerpt}"</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 text-center"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <Database className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Generated Data Found</h3>
            <p className="text-slate-500 max-w-md mt-2 px-10">
              Go to the <ArrowRight className="w-4 h-4 inline mx-1" /> <strong>MCQ Generator</strong> to create some magic. Once generated, the results will appear here for review and sync.
            </p>
            <Button variant="outline" className="mt-8 gap-2" asChild>
              <a href="/admin/mcq-generator">
                Go to Generator <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

