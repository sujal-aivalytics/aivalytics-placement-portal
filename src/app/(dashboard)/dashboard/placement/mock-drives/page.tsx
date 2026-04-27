'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Loader2,
    Briefcase,
    ArrowRight,
    ShieldAlert,
    Info,
    Monitor,
    Wifi,
    UserCheck,
    Clock,
    Target,
    AlertTriangle,
    CheckCircle2,
    Lock
} from 'lucide-react';

export default function MockDrivesPage() {
    const [drives, setDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/mock-drives')
            .then(res => res.json())
            .then(data => {
                setDrives(data.drives || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Helper to get color based on company
    const getCompanyColor = (name: string) => {
        const colors = [
            'from-blue-600 to-blue-400',
            'from-purple-600 to-purple-400',
            'from-indigo-600 to-indigo-400',
            'from-emerald-600 to-emerald-400'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                            Company Specific Mock Tests
                        </h1>
                        <p className="text-lg text-slate-500 font-medium tracking-tight">
                            Premium proctored assessments simulating real-world recruitment drives.
                        </p>
                    </div>

                    <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-full flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                        <span className="text-sm font-bold text-red-600 uppercase tracking-widest">AI Surveillance Active</span>
                    </div>
                </div>

                {/* Proctored Environment Banner */}
                <div className="bg-[#1e1e2d] text-white p-6 rounded-2xl mb-12 shadow-xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-red-500/20 transition-colors"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-red-400 mb-1 leading-none">Strict Proctored Environment</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-4xl">
                                These tests are monitored by AI Anti-Cheating System. <span className="text-white font-semibold">Tab switching, minimizing window, or multiple faces</span> will lead to immediate disqualification. Please ensure you are in a well-lit room.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[2rem] border border-slate-200 shadow-sm mb-12">
                        <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
                        <p className="text-slate-500 font-black uppercase text-xs tracking-[0.2em] animate-pulse">Synchronizing Assessment Registry...</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-[2rem] mb-16">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-50 bg-slate-50/50">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Company Target</th>
                                        <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assessment Core</th>
                                        <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</th>
                                        <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {drives.map((drive) => (
                                        <tr key={drive.id} className="group hover:bg-slate-50 transition-all duration-300">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getCompanyColor(drive.companyName)} text-white shadow-lg shadow-indigo-200 transition-transform duration-500 group-hover:scale-110`}>
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors tracking-tight uppercase">
                                                            {drive.companyName}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Active Drive</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{drive.title || `${drive.companyName} Drive`}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1 max-w-[200px]">
                                                        {drive.description || "Proctored Corporate Simulation"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-8">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Target className="w-4 h-4 text-slate-300" />
                                                    <span className="text-slate-900 text-sm">{drive.totalQuestions || 0}</span> Modules
                                                </div>
                                            </td>

                                            <td className="py-8">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Clock className="w-4 h-4 text-slate-300" />
                                                    <span className="text-slate-900 text-sm">{drive.totalDuration || 180}</span> Mins
                                                </div>
                                            </td>

                                            <td className="px-10 py-8 text-right">
                                                <Link href={`/dashboard/placement/mock-drives/${drive.id}`}>
                                                    <Button className="bg-slate-900 hover:bg-black text-white rounded-xl px-8 h-12 transition-all duration-300 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl group-hover:shadow-indigo-100">
                                                        Initialize
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Bottom Compliance Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Malpractice */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl -mr-8 -mt-8"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-amber-100 p-2.5 rounded-xl border border-amber-200">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Malpractice Code</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Leaving the test window at any time is recorded as a violation.",
                                "Using external devices (mobile phones, tablets) is strictly prohibited.",
                                "Background noise or speaking during the test will flag the session using Voice AI."
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 ring-4 ring-red-500/10"></div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Requirements */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -mr-8 -mt-8"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-emerald-100 p-2.5 rounded-xl border border-emerald-200">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">System Requirements</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { text: "Internet Speed: Minimum 2 Mbps stable connection.", icon: Wifi },
                                { text: "Webcam: Functional webcam for continuous proctoring.", icon: Monitor },
                                { text: "Browser: Latest version of Chrome or Edge (No private/incognito).", icon: Monitor }
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 ring-4 ring-emerald-500/10"></div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

