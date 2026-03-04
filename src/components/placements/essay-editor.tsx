'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';

interface EssayPrompt {
  id: string;
  title: string;
  prompt: string;
  wordLimit: {
    min: number;
    max: number;
  };
  guidelines: string[];
}

interface EssayEditorProps {
  prompt: EssayPrompt;
  onSubmit: (essay: string) => void;
  isSubmitting?: boolean;
}

export function EssayEditor({ prompt, onSubmit, isSubmitting = false }: EssayEditorProps) {
  const [essay, setEssay] = useState('');

  const { wordCount, charCount } = useMemo(() => {
    const words = essay.trim().split(/\s+/).filter(word => word.length > 0);
    return {
      wordCount: words.length,
      charCount: essay.length
    };
  }, [essay]);

  const getWordCountStatus = () => {
    if (wordCount < prompt.wordLimit.min) {
      return {
        color: 'text-red-600',
        message: `${prompt.wordLimit.min - wordCount} words needed`,
        icon: AlertCircle,
      };
    } else if (wordCount > prompt.wordLimit.max) {
      return {
        color: 'text-red-600',
        message: `${wordCount - prompt.wordLimit.max} words over limit`,
        icon: AlertCircle,
      };
    } else {
      return {
        color: 'text-green-600',
        message: 'Word count is within limit',
        icon: CheckCircle2,
      };
    }
  };

  const status = getWordCountStatus();
  const StatusIcon = status.icon;
  const isValidWordCount = wordCount >= prompt.wordLimit.min && wordCount <= prompt.wordLimit.max;

  const handleSubmit = () => {
    if (isValidWordCount) {
      onSubmit(essay);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Prompt Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{prompt.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Word Limit: {prompt.wordLimit.min} - {prompt.wordLimit.max} words
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">Essay Prompt</h3>
            <p className="text-gray-800 leading-relaxed text-lg">{prompt.prompt}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-lg mb-3 text-purple-900">Guidelines</h3>
            <ul className="space-y-2">
              {prompt.guidelines.map((guideline, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Editor Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Essay</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                <span className={status.color}>
                  {wordCount} / {prompt.wordLimit.max} words
                </span>
              </div>
              <span className="text-gray-500">
                {charCount} characters
              </span>
            </div>
          </div>
          <p className={`text-sm ${status.color} flex items-center gap-1 mt-2`}>
            <StatusIcon className="w-4 h-4" />
            {status.message}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            className="w-full h-[500px] p-6 text-base leading-relaxed bg-white rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Start writing your essay here..."
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {isValidWordCount ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Ready to submit
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  Please meet the word count requirement
                </span>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!isValidWordCount || isSubmitting}
              className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Essay'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg text-amber-900">Writing Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Start with a clear introduction that outlines your main points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Use specific examples and evidence to support your arguments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Maintain a logical flow between paragraphs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Conclude with a strong summary that reinforces your main points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Proofread for grammar, spelling, and punctuation errors</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
