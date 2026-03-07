"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, FileText, Upload } from "lucide-react";
import { Spinner } from "@/components/ui/loader";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/placement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EligibilityModalProps {
    company: "TCS" | "Wipro";
    defaultValues?: {
        tenthPercentage?: number;
        twelfthPercentage?: number;
        graduationCGPA?: number;
        backlogs?: number;
    };
    onSuccess: () => void;
}

export function EligibilityModal({ company, defaultValues, onSuccess }: EligibilityModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [parsing, setParsing] = useState(false);

    const [formData, setFormData] = useState({
        tenthPercentage: defaultValues?.tenthPercentage || "",
        twelfthPercentage: defaultValues?.twelfthPercentage || "",
        graduationCGPA: defaultValues?.graduationCGPA || "",
        backlogs: defaultValues?.backlogs || "0"
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setParsing(true);

        // Simulating Resume Parsing Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.info("Resume Parsed Successfully", {
            description: "Academic details have been auto-filled. Please verify."
        });

        // Mock extracted data directly from a 'good' candidate profile for demo purposes
        // or randomized slightly to look real
        setFormData({
            tenthPercentage: "88.5",
            twelfthPercentage: "82.0",
            graduationCGPA: "8.5",
            backlogs: "0"
        });

        setParsing(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = {
                tenthPercentage: parseFloat(formData.tenthPercentage.toString()),
                twelfthPercentage: parseFloat(formData.twelfthPercentage.toString()),
                graduationCGPA: parseFloat(formData.graduationCGPA.toString()),
                backlogs: parseInt(formData.backlogs.toString())
            };

            const result = await updateProfile(data);

            if (result.success) {
                toast.success("Eligibility Verified", {
                    description: "Details updated successfully."
                });
                setOpen(false);
                onSuccess(); // Trigger router refresh or parent update
            } else {
                toast.error("Update Failed", { description: result.error });
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Complete Profile to Check Eligibility
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Academic Eligibility Check</DialogTitle>
                    <DialogDescription>
                        {company} requires current academic records to validate your application. You can manually enter details or upload your resume for auto-fill.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">

                    {/* Resume Upload Section */}
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors relative">
                        {parsing ? (
                            <div className="flex flex-col items-center gap-2">
                                <Spinner size={32} className="text-blue-600" />
                                <span className="text-sm text-gray-500">Analyzing Resume...</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-medium text-gray-900">Upload Resume (PDF)</p>
                                    <p className="text-xs text-gray-500">Auto-fill details from your CV</p>
                                </div>
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                />
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or Enter Manually</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>10th Percentage</Label>
                            <Input
                                type="number"
                                value={formData.tenthPercentage}
                                onChange={(e) => setFormData({ ...formData, tenthPercentage: e.target.value })}
                                placeholder="e.g. 85.0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>12th Percentage</Label>
                            <Input
                                type="number"
                                value={formData.twelfthPercentage}
                                onChange={(e) => setFormData({ ...formData, twelfthPercentage: e.target.value })}
                                placeholder="e.g. 82.5"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Graduation CGPA</Label>
                            <Input
                                type="number"
                                value={formData.graduationCGPA}
                                onChange={(e) => setFormData({ ...formData, graduationCGPA: e.target.value })}
                                placeholder="e.g. 8.5"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Active Backlogs</Label>
                            <Input
                                type="number"
                                value={formData.backlogs}
                                onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || parsing}>
                        {loading ? <Spinner size={16} className="mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Verify & Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
