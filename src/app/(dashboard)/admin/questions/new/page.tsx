'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { createQuestion } from '@/lib/airtable';
import { Question } from '@/types';

// Since we can't directly call Airtable from client, we need an API route or Server Action.
// Let's create a simple API route for this example.

export default function NewQuestionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctOption: '',
    explanation: '',
    topic: '',
    difficulty: 'Medium',
    section: 'Quantitative',
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options as string[])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create question');

      router.push('/admin/questions');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error creating question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Input
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {formData.options?.map((opt, idx) => (
                <Input
                  key={idx}
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  required
                  className="mb-2"
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label>Correct Option (Exact Text)</Label>
              <Input
                value={formData.correctOption}
                onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Explanation</Label>
              <Input
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Company Tag (Optional)</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Question'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
