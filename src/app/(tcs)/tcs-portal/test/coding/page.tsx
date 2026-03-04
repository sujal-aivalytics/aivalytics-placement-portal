"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Send, Clock, AlertCircle, CheckCircle2, Terminal } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useProctoring } from "@/hooks/use-proctoring";
import { logMonitoringEvent } from "@/app/actions/monitoring";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const LANGUAGES = [
    { id: "python", name: "Python", version: "3.10.0", fileExt: "py" },
    { id: "java", name: "Java", version: "15.0.2", fileExt: "java" },
    { id: "c++", name: "C++", version: "10.2.0", fileExt: "cpp" },
    { id: "c", name: "C", version: "10.2.0", fileExt: "c" },
    { id: "javascript", name: "JavaScript", version: "18.15.0", fileExt: "js" },
];

const SAMPLE_PROBLEM = {
    title: "Eco-Friendly Routing",
    description: `A logistics company wants to minimize fuel consumption for its delivery trucks. 
    You are given a map of cities represented as a graph where nodes are cities and edges are roads with associated fuel costs.
    
    Write a function that returns the minimum fuel cost to travel from a starting city (Source) to a destination city (Target).
    
    Input Format:
    - First line: V (vertices) and E (edges)
    - Next E lines: u v w (edge from u to v with weight w)
    - Last line: Source Source_ID Destination Dest_ID
    
    Output Format:
    - Single integer representing minimum fuel cost. If unreachable, return -1.
    `,
    testCases: [
        { input: "5 6\n0 1 2\n0 2 4\n1 2 1\n1 3 7\n2 4 3\n3 4 2\n0 4", output: "5" }
    ]
};

const DEFAULT_CODE: Record<string, string> = {
    python: `def solve():\n    # Read input\n    # v, e = map(int, input().split())\n    # ...\n    print("5") # Sample Output\n\nif __name__ == "__main__":\n    solve()`,
    java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // int v = sc.nextInt();\n        System.out.println("5");\n    }\n}`,
    "c++": `#include <iostream>\nusing namespace std;\n\nint main() {\n    // int v, e;\n    // cin >> v >> e;\n    cout << "5" << endl;\n    return 0;\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    // int v, e;\n    // scanf("%d %d", &v, &e);\n    printf("5\\n");\n    return 0;\n}`,
    javascript: `// Read input from stdin\nconsole.log("5");`
};

export default function CodingTestPage() {
    const router = useRouter();
    const [language, setLanguage] = useState(LANGUAGES[0].id);
    const [code, setCode] = useState(DEFAULT_CODE['python']);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [verdict, setVerdict] = useState<"Passed" | "Failed" | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);

    // Timer Logic (Shared)
    useEffect(() => {
        const startTimeStr = localStorage.getItem('tcsTestStartTime');
        if (!startTimeStr) {
            // If no start time, we might redirect or just start a fresh timer for demo
            // router.replace('/tcs-portal/instructions');
            // For dev flow, let's just set a default if missing
            const now = Date.now();
            localStorage.setItem('tcsTestStartTime', now.toString());
        }

        const startTime = parseInt(localStorage.getItem('tcsTestStartTime') || Date.now().toString(), 10);
        const duration = 120 * 60 * 1000;
        const endTime = startTime + duration;

        const interval = setInterval(() => {
            const now = Date.now();
            const remain = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeLeft(remain);

            if (remain <= 0) {
                clearInterval(interval);
                toast.error("Time's Up! Submitting Assessment...");
                router.push('/tcs-portal/result');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const { warnings } = useProctoring({
        preventTabSwitch: true,
        onViolation: (type, msg) => {
            toast.error(msg);
            logMonitoringEvent("TCS-Coding", type, msg);
        }
    });

    const handleLanguageChange = (val: string) => {
        setLanguage(val);
        setCode(DEFAULT_CODE[val] || "");
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput("Compiling and Executing...");
        setVerdict(null);

        try {
            const langConfig = LANGUAGES.find(l => l.id === language);
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: langConfig?.id,
                    version: langConfig?.version,
                    files: [{ content: code }],
                    stdin: SAMPLE_PROBLEM.testCases[0].input
                })
            });

            const data = await response.json();

            if (data.run) {
                const rawOutput = data.run.output?.trim();
                setOutput(rawOutput || (data.run.stderr ? `Error:\n${data.run.stderr}` : "No Output"));

                // Simple Verdict Check
                if (rawOutput === SAMPLE_PROBLEM.testCases[0].output) {
                    setVerdict("Passed");
                    toast.success("Test Cases Passed!");
                } else {
                    setVerdict("Failed");
                    toast.error("Test Cases Failed");
                }
            } else {
                setOutput("Execution Error");
            }

        } catch (error) {
            setOutput("Failed to connect to execution engine.");
        } finally {
            setIsRunning(false);
        }
    };

    const submitCode = () => {
        const finalVerdict = verdict === "Passed" ? "Pass" : "Fail";
        localStorage.setItem('tcsCodingVerdict', finalVerdict);

        if (verdict === "Passed") {
            toast.success("Solution Submitted Successfully!");
            router.push('/tcs-portal/result');
        } else {
            toast.warning("Test cases failing. Submit anyway?", {
                action: {
                    label: "Yes, Submit",
                    onClick: () => router.push('/tcs-portal/result')
                }
            });
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b px-6 py-2 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-[#181C2E] flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-gray-500" />
                        Section: Hands-on Coding
                    </h2>
                </div>
                <div className="font-mono font-bold text-lg bg-gray-100 px-3 py-1 rounded border border-gray-300 flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left: Problem Statement */}
                <div className="w-1/3 bg-white border-r p-6 overflow-y-auto">
                    <h1 className="text-xl font-bold mb-4">{SAMPLE_PROBLEM.title}</h1>
                    <div className="prose text-sm text-gray-600 whitespace-pre-wrap font-sans">
                        {SAMPLE_PROBLEM.description}
                    </div>

                    <div className="mt-8 bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sample Input</h3>
                        <code className="text-sm block bg-white p-2 border rounded mb-4">{SAMPLE_PROBLEM.testCases[0].input}</code>

                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sample Output</h3>
                        <code className="text-sm block bg-white p-2 border rounded">{SAMPLE_PROBLEM.testCases[0].output}</code>
                    </div>
                </div>

                {/* Right: Code Editor & Console */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    {/* Toolbar */}
                    <div className="bg-[#2d2d2d] p-2 flex justify-between items-center border-b border-gray-700">
                        <Select value={language} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[180px] h-8 bg-[#3d3d3d] border-gray-600 text-gray-200">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGES.map(l => (
                                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 h-8 text-white border-0"
                                onClick={runCode}
                                disabled={isRunning}
                            >
                                <Play className="w-3 h-3 mr-2" /> {isRunning ? 'Running...' : 'Run Code'}
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-white border-0" onClick={submitCode}>
                                <Send className="w-3 h-3 mr-2" /> Submit
                            </Button>
                        </div>
                    </div>

                    {/* Editor Area (Simple Textarea for now) */}
                    <textarea
                        className="flex-1 bg-[#1e1e1e] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none"
                        spellCheck={false}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    {/* Console / Output */}
                    <div className="h-1/3 min-h-[150px] bg-[#0f0f0f] border-t border-gray-700 flex flex-col">
                        <div className="px-4 py-2 bg-[#1a1a1a] text-xs font-bold text-gray-400 border-b border-gray-800 flex justify-between">
                            <span>CONSOLE OUTPUT</span>
                            {verdict && (
                                <span className={verdict === "Passed" ? "text-green-500" : "text-red-500"}>
                                    Status: {verdict}
                                </span>
                            )}
                        </div>
                        <ScrollArea className="flex-1 p-4 font-mono text-sm text-gray-300">
                            <pre>{output || "Run your code to see output..."}</pre>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}
