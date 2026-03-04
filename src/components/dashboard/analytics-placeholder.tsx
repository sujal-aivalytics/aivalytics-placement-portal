
"use client";

import { cn } from "@/lib/utils";

export function AnalyticsPlaceholders() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-md border border-gray-100 p-6 rounded-3xl shadow-sm">
                <h3 className="font-semibold text-lg mb-6 text-gray-800">User Growth</h3>
                <div className="h-64 flex items-end justify-between px-4 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 95, 85, 100].map((h, i) => (
                        <div key={i} className="w-full bg-blue-500/10 rounded-t-lg relative group transition-all hover:bg-blue-500/20" style={{ height: `${h}%` }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%`, opacity: 0.8 }}></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-gray-100 p-6 rounded-3xl shadow-sm">
                <h3 className="font-semibold text-lg mb-6 text-gray-800">Test Completion</h3>
                <div className="h-64 flex items-center justify-center relative">
                    <div className="w-48 h-48 rounded-full border-[1.5rem] border-indigo-50 relative animate-spin-slow">
                        <div className="absolute inset-0 rounded-full border-[1.5rem] border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rotate-45 transform"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">76%</span>
                        <span className="text-sm text-gray-500">Completion</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
