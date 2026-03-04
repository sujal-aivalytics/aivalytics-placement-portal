"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, AlertCircle, Webcam, MonitorCheck } from "lucide-react";
import Link from 'next/link';

export default function WiproInstructionsPage() {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-up duration-500">

            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Assessment Guidelines</h1>
                <p className="text-slate-500">Please review the system requirements and protocols carefully.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Checks */}
                <Card className="border-0 shadow-lg shadow-blue-900/5 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500" />
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <MonitorCheck className="w-6 h-6 text-blue-500" />
                            <h3 className="font-bold text-lg text-slate-800">System Compatibility</h3>
                        </div>

                        <ul className="space-y-4">
                            {[
                                { label: "Browser Compatibility", status: "Verified", color: "text-green-600" },
                                { label: "Internet Bandwidth", status: "Stable", color: "text-green-600" },
                                { label: "Webcam Access", status: "Detected", color: "text-blue-600" },
                                { label: "Microphone Access", status: "Detected", color: "text-blue-600" }
                            ].map((check, i) => (
                                <li key={i} className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="text-slate-600">{check.label}</span>
                                    <span className={`font-medium ${check.color} flex items-center gap-1.5`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${check.color === 'text-green-600' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                        {check.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Rules */}
                <Card className="border-0 shadow-lg shadow-purple-900/5 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-purple-600" />
                            <h3 className="font-bold text-lg text-slate-800">Proctoring Rules</h3>
                        </div>

                        <div className="space-y-4 text-sm text-slate-600">
                            <p className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                The assessment window must remain active at all times. Minimizing or switching tabs is monitored.
                            </p>
                            <p className="flex gap-3">
                                <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                                The timer will start immediately upon launch. There are no pauses allowed.
                            </p>
                            <p className="flex gap-3">
                                <Webcam className="w-5 h-5 text-slate-400 shrink-0" />
                                Ensure your face is clearly visible to the camera throughout the session.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-xl bg-slate-900 text-white">
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <Checkbox
                            id="agree"
                            checked={agreed}
                            onCheckedChange={(c) => setAgreed(c as boolean)}
                            className="mt-1 border-slate-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <div className="space-y-1">
                            <label htmlFor="agree" className="font-bold text-lg cursor-pointer">I Acceptance of Terms</label>
                            <p className="text-slate-400 text-sm">I certify that I am the registered candidate and I agree to the proctoring terms.</p>
                        </div>
                    </div>

                    <Link href={agreed ? "/wipro-portal/test/aptitude" : "#"}>
                        <Button
                            size="lg"
                            className={`rounded-full px-8 text-base font-medium transition-all ${agreed ? 'bg-white text-slate-900 hover:bg-blue-50' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            disabled={!agreed}
                        >
                            Launch Assessment
                        </Button>
                    </Link>
                </CardContent>
            </Card>

        </div>
    );
}
