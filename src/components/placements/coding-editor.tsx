'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RotateCcw, CheckCircle2 } from 'lucide-react';

interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleInput: string;
  sampleOutput: string;
  explanation: string;
  testCases: {
    input: string;
    output: string;
  }[];
}

interface CodingEditorProps {
  problem: CodingProblem;
  onSubmit: (code: string, language: string) => void;
  isSubmitting?: boolean;
}

export function CodingEditor({ problem, onSubmit, isSubmitting = false }: CodingEditorProps) {
  const [code, setCode] = useState(`// Write your solution here\nfunction solve() {\n  \n}\n\nsolve();`);
  const [language, setLanguage] = useState('javascript');
  const [testOutput, setTestOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setTestOutput('Running test cases...\n\n');
    
    // Simulate running test cases
    setTimeout(() => {
      setTestOutput(
        `Test Case 1: Sample Input\nInput: ${problem.sampleInput}\nExpected Output: ${problem.sampleOutput}\nYour Output: (Run your code to see output)\nStatus: Pending\n\n` +
        `Note: This is a simulated environment. Your code will be evaluated on the server.`
      );
      setIsRunning(false);
    }, 1000);
  };

  const handleReset = () => {
    setCode(`// Write your solution here\nfunction solve() {\n  \n}\n\nsolve();`);
    setTestOutput('');
  };

  const handleSubmitCode = () => {
    onSubmit(code, language);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Problem Description */}
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{problem.title}</CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{problem.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Input Format</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{problem.inputFormat}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Output Format</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{problem.outputFormat}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Constraints</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx}>{constraint}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Sample Input</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                {problem.sampleInput}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Sample Output</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                {problem.sampleOutput}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Explanation</h3>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                {problem.explanation}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Editor */}
      <div className="space-y-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border rounded-lg bg-white text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <Tabs defaultValue="code" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="flex-1 mt-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[400px] p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
              </TabsContent>
              
              <TabsContent value="output" className="flex-1 mt-4">
                <div className="w-full h-[400px] p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-700 overflow-y-auto whitespace-pre-wrap">
                  {testOutput || 'Click &quot;Run Code&quot; to see output...'}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Button
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                variant="outline"
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              <Button
                onClick={handleReset}
                disabled={isSubmitting}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSubmitCode}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Make sure to test your code before submitting. You can only submit once.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
