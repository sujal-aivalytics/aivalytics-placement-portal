"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, GraduationCap, ArrowRight } from 'lucide-react';
import { saveEligibility } from '@/app/actions/eligibility';
import { toast } from "sonner";

interface EligibilityClientProps {
    testId: string;
    testTitle?: string;
    criteria?: {
        tenthPercentage?: number;
        twelfthPercentage?: number;
        graduationCGPA?: number;
        backlogs?: number;
    } | null;
}

export default function EligibilityClient({ testId, testTitle, criteria }: EligibilityClientProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        tenthMarks: '',
        twelfthMarks: '',
        degreeCGPA: '',
        backlogs: '0'
    });

    const [status, setStatus] = useState<'idle' | 'checking' | 'eligible' | 'not-eligible'>('idle');
    const [touched, setTouched] = useState(false);

    const handleCheck = () => {
        setTouched(true);
        setStatus('checking');

        setTimeout(() => {
            const tenth = parseFloat(form.tenthMarks);
            const twelfth = parseFloat(form.twelfthMarks);
            const cgpa = parseFloat(form.degreeCGPA);
            const backlogs = parseInt(form.backlogs);

            // Default checks if no specific criteria set (Open Access defaults)
            const minTenth = criteria?.tenthPercentage ?? 0;
            const minTwelfth = criteria?.twelfthPercentage ?? 0;
            const minCGPA = criteria?.graduationCGPA ?? 0;
            const maxBacklogs = criteria?.backlogs ?? 100;

            if (
                !isNaN(tenth) && tenth >= minTenth &&
                !isNaN(twelfth) && twelfth >= minTwelfth &&
                !isNaN(cgpa) && cgpa >= minCGPA &&
                !isNaN(backlogs) && backlogs <= maxBacklogs
            ) {
                setStatus('eligible');
            } else {
                setStatus('not-eligible');
            }
        }, 1500);
    };

    const handleProceed = async () => {
        console.log("Proceed button clicked via handleProceed");
        try {
            console.log("Calling saveEligibility...");
            const result = await saveEligibility(testId);
            console.log("saveEligibility result:", result);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            console.log("Refreshing router...");
            router.refresh();
            // Small delay to allow refresh to happen/revalidate logic to propagate
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log("Pushing to dashboard...");
            router.push(`/exam/${testId}/dashboard`);
        } catch (e) {
            console.error("Error in handleProceed:", e);
            toast.error("Failed to save status");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-600">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Eligibility Check</CardTitle>
                    <CardDescription>
                        Verify your academic details against the recruitment criteria.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>10th Marks (%)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 85.5"
                                value={form.tenthMarks}
                                onChange={e => setForm({ ...form, tenthMarks: e.target.value })}
                                disabled={status === 'eligible'}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>12th Marks (%)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 80.0"
                                value={form.twelfthMarks}
                                onChange={e => setForm({ ...form, twelfthMarks: e.target.value })}
                                disabled={status === 'eligible'}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>UG CGPA</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 7.5"
                                value={form.degreeCGPA}
                                onChange={e => setForm({ ...form, degreeCGPA: e.target.value })}
                                disabled={status === 'eligible'}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Active Backlogs</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={form.backlogs}
                                onChange={e => setForm({ ...form, backlogs: e.target.value })}
                                disabled={status === 'eligible'}
                            />
                        </div>
                    </div>

                    {/* Status Feedback */}
                    {status === 'checking' && (
                        <div className="flex items-center justify-center p-4 text-blue-600 animate-pulse bg-blue-50 rounded-lg">
                            Verifying Criteria...
                        </div>
                    )}

                    {status === 'eligible' && (
                        <div className="flex flex-col items-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-8 h-8 mb-2" />
                            <span className="font-bold">You are Eligible!</span>
                            <span className="text-xs">You meet all the academic requirements.</span>
                        </div>
                    )}

                    {status === 'not-eligible' && (
                        <div className="flex flex-col items-center p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-in fade-in zoom-in duration-300">
                            <XCircle className="w-8 h-8 mb-2" />
                            <span className="font-bold">Not Eligible</span>
                            <span className="text-xs text-center">Sorry, you do not meet the minimum criteria.</span>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {status === 'eligible' ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" onClick={handleProceed}>
                            Proceed to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleCheck}
                            disabled={status === 'checking' || !form.tenthMarks || !form.twelfthMarks || !form.degreeCGPA}
                        >
                            {status === 'not-eligible' ? 'Check Again' : 'Verify Eligibility'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
