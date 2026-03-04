import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getQuestions } from "@/lib/airtable";

export const dynamic = 'force-dynamic';

export default async function QuestionsPage() {
  const questions = await getQuestions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
        <Button asChild>
          <Link href="/admin/questions/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No questions found. Add your first question!
            </CardContent>
          </Card>
        ) : (
          questions.map((q) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-lg font-medium">{q.text}</CardTitle>
                <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-100">{q.topic}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-100">{q.difficulty}</span>
                  {q.company && <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded dark:bg-purple-900 dark:text-purple-100">{q.company}</span>}
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
