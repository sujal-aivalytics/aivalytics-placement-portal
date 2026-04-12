'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Trash2, BookOpen, FileText, Download, Search } from "lucide-react";
import { Spinner } from "@/components/ui/loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Test {
  id: string;
  title: string;
  type: string;
  company?: string;
  topic?: string;
}

interface Subtopic {
  id: string;
  testId: string;
  name: string;
  description?: string;
  totalQuestions: number;
  order?: number;
  test?: Test;
}

export default function AdminSubtopicsPage() {
  const searchParams = useSearchParams();
  const queryTestId = searchParams.get('testId');
  const querySubtopicId = searchParams.get('subtopicId');

  const [tests, setTests] = useState<Test[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>(queryTestId || '');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(!!querySubtopicId);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(querySubtopicId);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedTest) {
      fetchSubtopics(selectedTest);
    }
  }, [selectedTest]);

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests?exclude_type=mock');
      if (response.ok) {
        const data = await response.json();
        setTests(data.tests || []);
      }
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubtopics = async (testId: string) => {
    try {
      const response = await fetch(`/api/tests/${testId}/subtopics`);
      if (response.ok) {
        const data = await response.json();
        setSubtopics(data.subtopics || []);
      }
    } catch (error) {
      console.error('Failed to fetch subtopics:', error);
    }
  };

  const handleCreateSubtopic = async () => {
    if (!selectedTest) {
      alert('Please select a test first');
      return;
    }

    try {
      const response = await fetch(`/api/tests/${selectedTest}/subtopics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        setFormData({ name: '', description: '', order: 0 });
        fetchSubtopics(selectedTest);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating subtopic:', error);
      alert('Failed to create subtopic');
    }
  };

  const handleDeleteSubtopic = async (subtopicId: string, subtopicName: string) => {
    if (!confirm(`Are you sure you want to delete "${subtopicName}"? This will also delete all associated questions.`)) {
      return;
    }

    try {
      const subtopic = subtopics.find(s => s.id === subtopicId);
      if (!subtopic) return;

      const response = await fetch(`/api/tests/${subtopic.testId}/subtopics/${subtopicId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSubtopics(selectedTest);
      } else {
        alert('Failed to delete subtopic');
      }
    } catch (error) {
      console.error('Error deleting subtopic:', error);
      alert('Failed to delete subtopic');
    }
  };

  const handleUploadCSV = async () => {
    if (!uploadFile || !selectedSubtopic || !selectedTest) {
      alert('Please select a file and subtopic');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('testId', selectedTest);
      formData.append('subtopicId', selectedSubtopic);

      const response = await fetch('/api/admin/subtopics/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);

      if (response.ok) {
        fetchSubtopics(selectedTest);
        setTimeout(() => {
          setIsUploadDialogOpen(false);
          setUploadFile(null);
          setSelectedSubtopic(null);
          setUploadResult(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({ error: 'Failed to upload file' });
    } finally {
      setUploading(false);
    }
  };

  const downloadCsvTemplate = () => {
    const headers = ["question", "option_1", "option_2", "option_3", "option_4", "correct_option", "explanation", "difficulty", "category"];
    const sampleRow = ["What is 2+2?", "2", "3", "4", "5", "C", "Basic arithmetic", "Easy", "Mathematics"];

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + sampleRow.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "questions_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubtopics = subtopics.filter(subtopic =>
    subtopic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subtopic.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Resource Bank</h1>
          <p className="text-gray-500 mt-1">Manage subtopics and upload questions for your tests</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={downloadCsvTemplate}
            variant="outline"
            className="shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            CSV Template
          </Button>
        </div>
      </div>

      {/* Test Selection */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Select Test
          </CardTitle>
          <CardDescription>Choose a test to manage its subtopics and questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedTest} onValueChange={setSelectedTest}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a test..." />
            </SelectTrigger>
            <SelectContent>
              {tests.map((test) => (
                <SelectItem key={test.id} value={test.id}>
                  {test.title} {test.type === 'company' ? `(${test.company})` : `(${test.topic})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Subtopics Section */}
      {selectedTest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subtopics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                variant="outline"
                className="shadow-sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Questions
              </Button>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Subtopic
              </Button>
            </div>
          </div>

          {/* Subtopics Grid */}
          {filteredSubtopics.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-blue-50 rounded-full">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">No subtopics found</h3>
                    <p className="text-gray-500 mt-1">
                      {searchQuery ? 'Try a different search term' : 'Create your first subtopic to get started'}
                    </p>
                  </div>
                  {!searchQuery && (
                    <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Subtopic
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredSubtopics.map((subtopic, index) => (
                  <motion.div
                    key={subtopic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{subtopic.name}</CardTitle>
                              {subtopic.order !== null && (
                                <Badge variant="outline" className="mt-1">
                                  Order: {subtopic.order}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {subtopic.description && (
                          <CardDescription className="mt-2 line-clamp-2">
                            {subtopic.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Total Questions</span>
                          <Badge className="bg-blue-600 hover:bg-blue-700">
                            {subtopic.totalQuestions}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedSubtopic(subtopic.id);
                              setIsUploadDialogOpen(true);
                            }}
                          >
                            <Upload className="mr-2 h-3.5 w-3.5" />
                            Upload
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSubtopic(subtopic.id, subtopic.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}

      {/* Create Subtopic Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Subtopic</DialogTitle>
            <DialogDescription>
              Add a new subtopic to organize questions within the selected test.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subtopic Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Quantitative Aptitude, Logical Reasoning"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this subtopic"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                placeholder="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first. Use 0 for auto-assignment.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubtopic} disabled={!formData.name}>
              Create Subtopic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload CSV Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Questions CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with questions for the selected subtopic
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subtopic">Select Subtopic *</Label>
                <Select value={selectedSubtopic || 'none'} onValueChange={(val) => setSelectedSubtopic(val === 'none' ? null : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subtopic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subtopics.map((subtopic) => (
                      <SelectItem key={subtopic.id} value={subtopic.id}>
                        {subtopic.name} ({subtopic.totalQuestions} questions)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">CSV File *</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900 font-medium mb-1">CSV Format:</p>
                <p className="text-xs text-blue-700">
                  Required columns: question, option_1, option_2, option_3, option_4, correct_option (A/B/C/D or 1-4)
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Optional: explanation, difficulty, category
                </p>
              </div>
            </div>
            {uploadResult && (
              <div className={`p-4 rounded-lg ${uploadResult.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <p className={`font-semibold ${uploadResult.error ? 'text-red-900' : 'text-green-900'}`}>
                  {uploadResult.error || uploadResult.message}
                </p>
                {uploadResult.created && (
                  <p className="text-sm mt-1 text-green-800">Created: {uploadResult.created} questions</p>
                )}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-2 text-sm">
                    <p className="font-semibold text-red-900">Errors:</p>
                    <ul className="list-disc list-inside max-h-40 overflow-y-auto text-red-800">
                      {uploadResult.errors.slice(0, 10).map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                      {uploadResult.errors.length > 10 && (
                        <li>... and {uploadResult.errors.length - 10} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadCSV}
              disabled={!uploadFile || !selectedSubtopic || uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? 'Uploading...' : 'Upload Questions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
