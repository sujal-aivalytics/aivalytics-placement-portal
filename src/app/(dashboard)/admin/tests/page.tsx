
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, GraduationCap, Trash2, FileEdit, BookOpen } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Spinner } from "@/components/ui/loader";

interface Test {
  id: string;
  title: string;
  type: string;
  duration: number;
  difficulty: string;
  company?: string;
  topic?: string;
  _count: {
    questions: number;
  };
}

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

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

  const handleDelete = async (testId: string, testTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${testTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(testId);
    try {
      const response = await fetch(`/api/tests?id=${testId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTests(tests.filter(test => test.id !== testId));
        alert('Test deleted successfully');
      } else {
        alert('Failed to delete test');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Error deleting test');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Curriculum Management</h1>
        </div>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Spinner size={40} className="text-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Curriculum Management</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
          <Link href="/admin/tests/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Test
          </Link>
        </Button>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No tests found. Create your first test!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id} className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {test.type === 'company' ? `Company: ${test.company}` : `Topic: ${test.topic}`}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{test._count.questions} Questions</span>
                  <span>{test.duration} mins</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/admin/tests/${test.id}`}>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Manage
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(test.id, test.title)}
                    disabled={deletingId === test.id}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
