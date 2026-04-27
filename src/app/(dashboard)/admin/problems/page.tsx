"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, Code, FileText, Settings, CheckCircle2, X, Wand2, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/loader";

interface ValidationStatus {
  examples: boolean;
  starterTemplate: boolean;
  driverCode: boolean;
  testCases: boolean;
}

export default function CreateProblemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [autoFixLoading, setAutoFixLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [correctionLog, setCorrectionLog] = useState<string[]>([]);
  const [showCorrectionLog, setShowCorrectionLog] = useState(false);
  const [validation, setValidation] = useState<ValidationStatus>({
    examples: true,
    starterTemplate: true,
    driverCode: true,
    testCases: true,
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    constraints: "",
    difficulty: "Easy",
    category: "DSA",
    type: "Arrays",
    expectedTime: "O(n)",
    expectedSpace: "O(1)",
    examples: "",
    starterTemplate: "",
    driverCode: "",
    testCases: "",
  });

  // Validate JSON fields
  const validateJSON = useCallback((): ValidationStatus => {
    const check = (val: string): boolean => {
      if (!val || !val.trim()) return true;
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    };

    const status = {
      examples: check(form.examples),
      starterTemplate: check(form.starterTemplate),
      driverCode: check(form.driverCode),
      testCases: check(form.testCases),
    };
    setValidation(status);
    return status;
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate JSON fields on change
    if (['examples', 'starterTemplate', 'driverCode', 'testCases'].includes(name)) {
      try {
        if (value.trim()) JSON.parse(value);
        setValidation(prev => ({ ...prev, [name]: true }));
      } catch {
        setValidation(prev => ({ ...prev, [name]: false }));
      }
    }
  };

  // AI Auto-fix function
  const handleAutoFix = async () => {
    setAutoFixLoading(true);
    setCorrectionLog([]);
    
    try {
      const res = await fetch('/api/admin/problems/correct-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          constraints: form.constraints,
          examples: form.examples,
          starterTemplate: form.starterTemplate,
          driverCode: form.driverCode,
          testCases: form.testCases,
          useAI: true
        }),
      });

      if (res.ok) {
        const result = await res.json();
        
        // Update form with corrected values
        setForm(prev => ({
          ...prev,
          examples: JSON.stringify(result.data.examples, null, 2),
          starterTemplate: JSON.stringify(result.data.starterTemplate, null, 2),
          driverCode: JSON.stringify(result.data.driverCode, null, 2),
          testCases: JSON.stringify(result.data.testCases, null, 2),
        }));

        // Update validation status
        setValidation({
          examples: true,
          starterTemplate: true,
          driverCode: true,
          testCases: true,
        });

        // Show corrections
        setCorrectionLog(result.corrections || []);
        setShowCorrectionLog(true);
        
        // Auto-hide correction log after 5 seconds
        setTimeout(() => setShowCorrectionLog(false), 5000);
      } else {
        alert('AI correction failed. Please check your inputs manually.');
      }
    } catch (error) {
      console.error('Auto-fix error:', error);
      alert('Failed to auto-correct. Please try again.');
    } finally {
      setAutoFixLoading(false);
    }
  };

  const submit = async () => {
    // First validate all JSON fields
    const isValid = validateJSON();
    const allValid = Object.values(isValid).every(v => v);

    if (!allValid) {
      const invalidFields = Object.entries(isValid)
        .filter(([, v]) => !v)
        .map(([k]) => k)
        .join(', ');
      
      const shouldAutoFix = confirm(
        `JSON syntax error in: ${invalidFields}\n\nWould you like AI to auto-fix these issues?`
      );
      
      if (shouldAutoFix) {
        await handleAutoFix();
      }
      return;
    }

    try {
      setLoading(true);

      // Parse JSON fields before sending
      const payload = {
        ...form,
        examples: JSON.parse(form.examples || "[]"),
        starterTemplate: JSON.parse(form.starterTemplate || "{}"),
        driverCode: JSON.parse(form.driverCode || "{}"),
        testCases: JSON.parse(form.testCases || "[]"),
      };

      const res = await fetch("/api/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      // Show the success modal and stop loading
      setShowSuccess(true);
      setLoading(false);

    } catch (err) {
      alert("Error saving problem. Please try again.");
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccess(false);
    router.push("/admin/problems");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">

      {/* SUCCESS POPUP OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full mx-4 border border-slate-100 transform transition-all animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900">Problem Saved!</h3>
              <p className="text-slate-500 mt-2 font-medium">Your problem has been successfully added to the database.</p>
            </div>

            {/* MANUAL OK BUTTON */}
            <button
              onClick={handleModalClose}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {/* CORRECTION LOG TOAST */}
      {showCorrectionLog && correctionLog.length > 0 && (
        <div className="fixed top-20 right-8 z-50 max-w-sm animate-in slide-in-from-right duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-800 text-sm">AI Auto-Corrections Applied</span>
            </div>
            <ul className="text-xs text-emerald-700 space-y-1">
              {correctionLog.map((correction, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {correction}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 backdrop-blur-md px-8 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Create New Problem</h1>
            <p className="text-xs text-slate-500 mt-1">Design and publish a new challenge to AiValytics</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAutoFix}
            disabled={autoFixLoading || Object.values(validation).every(v => v)}
            className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 active:scale-95 disabled:opacity-50 transition-all"
            title="Auto-fix JSON syntax errors with AI"
          >
            {autoFixLoading ? (
              <>
                <Spinner size={14} className="text-amber-600" />
                <span>Fixing...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>AI Fix JSON</span>
              </>
            )}
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Spinner size={16} className="text-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Problem</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className={`mx-auto mt-8 max-w-5xl space-y-8 px-8 transition-all duration-500 ${showSuccess ? 'blur-sm scale-[0.98] pointer-events-none opacity-50' : ''}`}>

        {/* SECTION 1: GENERAL INFO */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FileText className="text-indigo-600" size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">General Information</h2>
          </div>

          <div className="space-y-6">
            <Input name="title" label="Problem Title" placeholder="e.g. Palindrome Number" onChange={handleChange} />

            <div className="grid grid-cols-3 gap-8">
              <Select name="difficulty" label="Difficulty Level" onChange={handleChange} options={["Easy", "Medium", "Hard"]} />
              <Select name="category" label="Problem Category" onChange={handleChange} options={["DSA", "SQL", "MCQ"]} />
              <Select name="type" label="Problem Type" onChange={handleChange} options={["Arrays", "Strings", "DP", "Graphs", "Math"]} />
            </div>

            <Textarea name="description" label="Description (Markdown)" placeholder="Explain the problem clearly..." onChange={handleChange} />
            <Textarea name="constraints" label="Constraints" placeholder="e.g. 1 <= n <= 10^9" onChange={handleChange} />
          </div>
        </section>

        {/* SECTION 2: COMPLEXITY */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Settings className="text-amber-600" size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Complexity Benchmarks</h2>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <Input name="expectedTime" label="Time Complexity" placeholder="O(log n)" onChange={handleChange} />
            <Input name="expectedSpace" label="Space Complexity" placeholder="O(1)" onChange={handleChange} />
          </div>
        </section>

        {/* SECTION 3: TECHNICAL JSON DATA */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Code className="text-emerald-600" size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Technical Configuration (JSON)</h2>
                <p className="text-xs text-slate-500">Enter valid JSON. AI can auto-fix common syntax errors.</p>
              </div>
            </div>
            {!Object.values(validation).every(v => v) && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-medium">
                <AlertCircle size={14} />
                <span>JSON validation errors detected</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Textarea 
              name="examples" 
              label="Examples JSON" 
              isCode 
              isValid={validation.examples}
              value={form.examples}
              placeholder="[{ 'input': '...', 'output': '...' }]" 
              onChange={handleChange} 
            />
            <Textarea 
              name="testCases" 
              label="Test Cases JSON" 
              isCode 
              isValid={validation.testCases}
              value={form.testCases}
              placeholder="[{ 'id': 1, 'input': '...', 'output': '...' }]" 
              onChange={handleChange} 
            />
            <Textarea 
              name="starterTemplate" 
              label="Starter Template JSON" 
              isCode 
              isValid={validation.starterTemplate}
              value={form.starterTemplate}
              placeholder="{ 'cpp': '...', 'python': '...' }" 
              onChange={handleChange} 
            />
            <Textarea 
              name="driverCode" 
              label="Driver Code JSON" 
              isCode 
              isValid={validation.driverCode}
              value={form.driverCode}
              placeholder="{ 'cpp': '...', 'python': '...' }" 
              onChange={handleChange} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------- CUSTOM STYLED UI COMPONENTS ---------------- */

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
      <input
        {...props}
        className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
      />
    </div>
  );
}

function Textarea({ label, isCode, isValid, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
        {label}
        {isCode && isValid !== undefined && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${isValid ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {isValid ? 'Valid JSON' : 'Invalid JSON'}
          </span>
        )}
      </label>
      <textarea
        {...props}
        rows={isCode ? 10 : 5}
        className={`rounded-xl border p-4 text-sm transition-all outline-none focus:ring-4 ${
          isCode
            ? `font-mono ${isValid === false ? 'bg-red-950/30 border-red-400 text-red-200 focus:border-red-400 focus:ring-red-500/20' : 'bg-slate-900 text-indigo-300 focus:border-indigo-400 focus:ring-indigo-500/20'}`
            : "bg-slate-50/50 border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/10"
        }`}
      />
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
      <select
        {...props}
        className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all cursor-pointer focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
      >
        {options.map((o: string) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
