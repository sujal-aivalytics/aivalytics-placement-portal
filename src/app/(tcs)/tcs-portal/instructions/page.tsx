"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, ShieldCheck, MonitorX } from "lucide-react";
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function TCSInstructionsPage() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);

    const handleStart = async () => {
        if (agreed) {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } catch (err) {
                console.error("Fullscreen denied:", err);
            }

            localStorage.setItem('tcsTestStartTime', Date.now().toString());
            router.push("/tcs-portal/test/aptitude");
        }
    };

    return (
        <div className="flex-1 bg-gray-50 p-6 md:p-10 flex justify-center">
            <Card className="max-w-4xl w-full shadow-lg border-t-4 border-t-[#181C2E]">
                <div className="p-6 md:p-8 space-y-6">

                    <div className="border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-bold text-[#181C2E]">Assessment Guidelines & Instructions</h1>
                        <p className="text-gray-500 mt-1">Please read the following instructions carefully before proceeding.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex flex-col items-center text-center gap-2">
                            <Clock className="w-8 h-8 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Timed Assessment</h3>
                            <p className="text-xs text-gray-600">The total duration is 120 minutes. Timer cannot be paused.</p>
                        </div>
                        <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 flex flex-col items-center text-center gap-2">
                            <AlertTriangle className="w-8 h-8 text-amber-600" />
                            <h3 className="font-semibold text-gray-900">Proctoring Enabled</h3>
                            <p className="text-xs text-gray-600">Video and Audio are monitored. Do not look away from screen.</p>
                        </div>
                        <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 flex flex-col items-center text-center gap-2">
                            <MonitorX className="w-8 h-8 text-red-600" />
                            <h3 className="font-semibold text-gray-900">No Window Switching</h3>
                            <p className="text-xs text-gray-600">Switching tabs or minimizing window will terminate the test.</p>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-bold text-gray-900">General Instructions:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                            <li>The examination consists of 3 sections: aptitude, logical reasoning, and coding.</li>
                            <li>All questions are mandatory. There is no negative marking.</li>
                            <li>Ensure you have a stable internet connection clearly capable of video streaming.</li>
                            <li>Do not press F5 or Refresh button during the test.</li>
                            <li>Use of calculators or external devices is strictly prohibited.</li>
                            <li>In case of technical issues, wait for the network to restore. The timer will resume.</li>
                            <li>Any attempting of malpractice will result in immediate disqualification.</li>
                            <li>System will take automated snapshots every 30 seconds.</li>
                        </ul>

                        <h3 className="font-bold text-gray-900 mt-4">Browser Requirements:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                            <li>Google Chrome (Version 80+)</li>
                            <li>JavaScript Enabled</li>
                            <li>Pop-ups Allowed for this site</li>
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white transition-colors cursor-pointer" onClick={() => setAgreed(!agreed)}>
                            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    I have read and understood all the instructions.
                                </label>
                                <p className="text-sm text-gray-500">
                                    I agree to be proctored via webcam and microphone.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <Link href="/tcs-portal">
                            <Button variant="ghost" className="text-gray-500">Cancel</Button>
                        </Link>
                        <Button
                            className={`px-8 h-11 transition-all ${agreed ? 'bg-[#181C2E] hover:bg-[#2C3E50]' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
                            disabled={!agreed}
                            onClick={handleStart}
                        >
                            Start Assessment
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
