import React from 'react';
import { Poppins } from 'next/font/google';
export const dynamic = "force-dynamic";

import { Building2 } from 'lucide-react';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700']
});

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function WiproLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const userName = session?.user?.name || "Candidate";
    const userEmail = session?.user?.email || "candidate@example.com"; // Fallback/Hidden if needed, mostly for logic

    return (
        <div className={`min-h-screen bg-slate-50 text-slate-900 ${poppins.className}`}>
            {/* Background Ambience - Wipro Style Gradients */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-l from-cyan-400 to-blue-600 blur-3xl opacity-70" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-18 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/50 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    {/* Wipro Branding */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="hidden md:flex flex-col border-l border-slate-300 pl-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">Digital</span>
                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-[0.1em] leading-tight">Assessment</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Candidate</span>
                            <span className="text-sm font-medium text-slate-800">{userName}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-700 font-bold overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 pt-24 min-h-screen px-4 pb-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

        </div>
    );
}
