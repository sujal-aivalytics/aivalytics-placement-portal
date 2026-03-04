'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { parseJsonSafely } from '@/lib/fetch-utils';

interface Test {
  id: string;
  title: string;
}

export default function BulkUploadPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Fetch tests for the dropdown
    fetch('/api/tests')
      .then(parseJsonSafely)
      .then(data => {
        if (data.tests) {
          setTests(data.tests);
        } else {
          console.error('Invalid tests data:', data);
          console.error('Full response:', JSON.stringify(data, null, 2));
          setTests([]);
        }
      })
      .catch(err => console.error('Failed to fetch tests:', err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedTest) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('testId', selectedTest);

    try {
      const res = await fetch('/api/admin/questions/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: data.message });
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('csv-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setResult({ success: false, message: data.error || 'Upload failed' });
      }
    } catch (error) {
      setResult({ success: false, message: 'An error occurred during upload' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bulk Upload Questions</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Upload a CSV file with the following format:<br/>
            <code>Question Text, Option 1, Option 2, Option 3, Option 4, Correct Option (1-4)</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="test">Select Test</Label>
              <Select value={selectedTest} onValueChange={setSelectedTest}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a test..." />
                </SelectTrigger>
                <SelectContent>
                  {tests.map(test => (
                    <SelectItem key={test.id} value={test.id}>
                      {test.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {result && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${result.success ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
                {result.success ? <CheckCircle className="h-5 w-5 mt-0.5" /> : <AlertCircle className="h-5 w-5 mt-0.5" />}
                <div>
                  <h5 className="font-medium mb-1">{result.success ? "Success" : "Error"}</h5>
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !file || !selectedTest}>
              {loading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload Questions
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example CSV Content</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            Question,Option 1,Option 2,Option 3,Option 4,Correct Index{'\n'}
            What is 2+2?,3,4,5,6,2{'\n'}
            Capital of France?,London,Berlin,Madrid,Paris,4
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
