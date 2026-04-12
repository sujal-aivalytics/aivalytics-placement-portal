"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Upload, Download, FileText, Loader2, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MCQGeneratorPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState("");
    const [keywords, setKeywords] = useState("");
    const [difficulty, setDifficulty] = useState("Medium");
    const [bloomsLevel, setBloomsLevel] = useState("Understand");
    const [count, setCount] = useState(5);
    const [activeTab, setActiveTab] = useState<"text" | "file">("text");
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<any[] | null>(null);

    const handleGenerate = async () => {
        if (activeTab === "text" && !content.trim()) {
            toast.error("Please enter content");
            return;
        }
        if (activeTab === "file" && !file) {
            toast.error("Please select a file");
            return;
        }

        setIsLoading(true);
        setResults(null);

        try {
            let body;
            const headers: Record<string, string> = {};

            if (activeTab === "file") {
                const formData = new FormData();
                if (file) formData.append("file", file);
                formData.append("keywords", keywords);
                formData.append("difficulty", difficulty);
                formData.append("bloomsLevel", bloomsLevel);
                formData.append("count", count.toString());
                body = formData;
            } else {
                body = JSON.stringify({
                    content,
                    keywords: keywords.split(",").map(k => k.trim()).filter(k => k),
                    difficulty,
                    bloomsLevel,
                    count
                });
                headers["Content-Type"] = "application/json";
            }

            const response = await fetch("/api/generate-mcq", {
                method: "POST",
                headers: activeTab === "file" ? undefined : headers,
                body: body
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Failed to generate MCQs";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error || errorMessage;
                } catch (e) {
                    errorMessage = `Server Error (${response.status}): ${errorText.substring(0, 100)}...`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setResults(data.data);
            toast.success("MCQs Generated Successfully!");
        } catch (error: any) {
            console.error("Client Error:", error);
            
            // Check if it's a quota error and show a more helpful message
            const errorMsg = error.message || String(error);
            if (errorMsg.includes("Quota") || errorMsg.includes("quota") || errorMsg.includes("429")) {
                toast.error(errorMsg, { duration: 10000 }); // Show for 10 seconds
            } else {
                toast.error(errorMsg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!results) return;
        navigator.clipboard.writeText(JSON.stringify(results, null, 2));
        toast.success("Copied JSON to clipboard");
    };

    const downloadCSV = () => {
        if (!results) return;

        // CSV Header
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Topic,Question,Option A,Option B,Option C,Option D,Correct Answer,Difficulty,Bloom's Level,Reference\n";

        // CSV Rows
        results.forEach(group => {
            group.questions.forEach((q: any) => {
                const row = [
                    `"${group.keyword.replace(/"/g, '""')}"`,
                    `"${q.question.replace(/"/g, '""')}"`,
                    `"${q.options.find((o: any) => o.label === 'A')?.text.replace(/"/g, '""') || ''}"`,
                    `"${q.options.find((o: any) => o.label === 'B')?.text.replace(/"/g, '""') || ''}"`,
                    `"${q.options.find((o: any) => o.label === 'C')?.text.replace(/"/g, '""') || ''}"`,
                    `"${q.options.find((o: any) => o.label === 'D')?.text.replace(/"/g, '""') || ''}"`,
                    `"${q.correct_answer.replace(/"/g, '""')}"`,
                    `"${q.difficulty}"`,
                    `"${q.blooms_level}"`,
                    `"${(q.reference_excerpt || '').replace(/"/g, '""')}"`
                ].join(",");
                csvContent += row + "\n";
            });
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "generated_mcqs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Downloaded CSV");
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">AI MCQ Generator</h1>
                </div>
                <p className="text-muted-foreground">
                    Generate syllabus-aligned MCQs from your content using AI. Upload a file or paste text.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Input Section */}
                <div className="lg:col-span-4 space-y-4 p-6 border rounded-xl bg-card text-card-foreground shadow-sm h-fit">
                    <h2 className="text-xl font-semibold mb-4">Configuration</h2>

                    {/* Tabs */}
                    <div className="flex bg-muted p-1 rounded-lg mb-6">
                        <button
                            onClick={() => setActiveTab("text")}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "text"
                                ? "bg-background shadow text-foreground"
                                : "text-muted-foreground hover:bg-background/50"
                                }`}
                        >
                            Paste Text
                        </button>
                        <button
                            onClick={() => setActiveTab("file")}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "file"
                                ? "bg-background shadow text-foreground"
                                : "text-muted-foreground hover:bg-background/50"
                                }`}
                        >
                            Upload File
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "text" ? (
                            <motion.div
                                key="text"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
                                <label className="text-sm font-medium">Source Content</label>
                                <textarea
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                    placeholder="Paste your chapter text, notes, or article here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="file"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
                                <label className="text-sm font-medium">Upload Document</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 border-gray-300 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                            {file ? (
                                                <>
                                                    <FileText className="w-8 h-8 mb-3 text-primary" />
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-full">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PDF, DOCX, or TXT (MAX. 4MB)
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.docx,.txt"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-3 pt-4 border-t">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Keywords <span className="text-muted-foreground font-normal">(Optional - leave empty to auto-detect)</span></label>
                            <input
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. Newton's Laws, Inertia, Force"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Difficulty</label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bloom's Level</label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={bloomsLevel}
                                    onChange={(e) => setBloomsLevel(e.target.value)}
                                >
                                    <option value="Remember">Remember</option>
                                    <option value="Understand">Understand</option>
                                    <option value="Apply">Apply</option>
                                    <option value="Analyze">Analyze</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Questions per Keyword ({count})</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                            />
                        </div>

                        <Button
                            className="w-full mt-4"
                            size="lg"
                            onClick={handleGenerate}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate Questions"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-8 space-y-6">
                    {results && (
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Generated Results</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Download CSV
                                </Button>
                                <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                                    <Copy className="w-4 h-4" />
                                    Copy JSON
                                </Button>
                                <Button variant="default" size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700" asChild>
                                    <a href="/admin/local-data">
                                        <ArrowRight className="w-4 h-4" />
                                        Review & Sync
                                    </a>
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center p-12 border rounded-xl bg-card">
                                <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
                                <p className="text-lg font-medium text-foreground">Generating Questions...</p>
                                <p className="text-sm text-muted-foreground">This may take up to 30 seconds.</p>
                            </div>
                        )}

                        {!isLoading && !results && (
                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-gray-50/50 text-center h-[500px]">
                                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                    <Brain className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">No Questions Generated Yet</h3>
                                <p className="text-gray-500 max-w-sm mt-2">
                                    Configure the settings on the left and click "Generate Questions" to see the magic happen.
                                </p>
                            </div>
                        )}

                        {results && results.map((group: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-primary">Topic: {group.keyword}</h3>
                                    <div className="h-px bg-border flex-1" />
                                </div>

                                {group.questions.map((q: any, qIdx: number) => (
                                    <div key={qIdx} className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 flex gap-2">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                                                {q.difficulty}
                                            </span>
                                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
                                                {q.blooms_level}
                                            </span>
                                        </div>

                                        <p className="font-medium text-lg mb-4 pr-20">{qIdx + 1}. {q.question}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                            {q.options.map((opt: any, oIdx: number) => (
                                                <div
                                                    key={oIdx}
                                                    className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${opt.text === q.correct_answer
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-white hover:bg-gray-50 border-gray-100"
                                                        }`}
                                                >
                                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${opt.text === q.correct_answer
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                        {opt.label}
                                                    </span>
                                                    <span className={`text-sm ${opt.text === q.correct_answer ? "text-green-900 font-medium" : "text-gray-600"
                                                        }`}>
                                                        {opt.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {q.reference_excerpt && (
                                            <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-start gap-2">
                                                <FileText className="w-3 h-3 mt-0.5 shrink-0" />
                                                <p>Source context: "{q.reference_excerpt}"</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
