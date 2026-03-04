'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Clock, Target, Shield, BookOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    difficulty: 'Medium',
    type: 'topic',
    topicOrCompany: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration.toString()),
        difficulty: formData.difficulty,
        type: formData.type,
        company: formData.type === 'company' ? formData.topicOrCompany : undefined,
        topic: formData.type === 'topic' ? formData.topicOrCompany : undefined,
      };

      console.log('Creating test with payload:', payload);

      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', res.status, res.statusText);

      if (res.ok) {
        const data = await res.json();
        console.log('Test created successfully:', data);
        router.push('/admin/tests');
        router.refresh();
      } else {
        // Try to parse error response
        let errorData;
        let errorMessage = 'Failed to create test';
        
        try {
          const text = await res.text();
          console.log('Error response text:', text);
          
          if (text) {
            errorData = JSON.parse(text);
            errorMessage = errorData.details || errorData.error || errorMessage;
            console.error('Failed to create test:', errorData);
          } else {
            console.error('Empty error response from server');
            errorMessage = `Server returned ${res.status} with no error details`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Server error (${res.status}): Unable to parse response`;
        }
        
        alert(`Failed to create test: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error creating test:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error creating test: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/admin/tests">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Assessment</h1>
          <p className="text-sm text-muted-foreground">Setup a new test for your students</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-blue-500/5 overflow-hidden">
        <div className="h-2 bg-blue-600 w-full" />
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Assessment Details</CardTitle>
              <CardDescription>Fill in the basic information about the test</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Test Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., TCS NQT Mock 1 or Data Structures Midterm"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  className="flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  placeholder="Provide a brief overview of what this test covers..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    Test Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat transition-all"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="topic">Topic Wise</option>
                    <option value="company">Company Specific</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    placeholder="30"
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topicOrCompany" className="text-sm font-semibold flex items-center gap-2">
                  {formData.type === 'company' ? (
                    <Shield className="w-4 h-4 text-blue-500" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  )}
                  {formData.type === 'company' ? 'Target Company' : 'Topic Name'}
                </Label>
                <Input
                  id="topicOrCompany"
                  name="topicOrCompany"
                  placeholder={formData.type === 'company' ? "e.g., TCS, Google, Microsoft" : "e.g., Time & Work, Linked Lists"}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  value={formData.topicOrCompany}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Difficulty Level
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, difficulty: lvl }))}
                      className={`h-12 rounded-xl text-sm font-bold border transition-all ${formData.difficulty === lvl
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50'
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : 'Finalize & Create Test'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
