import React from 'react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { getOrCreatePlacementApplication } from "@/app/actions/placement";
import { Building2 } from 'lucide-react';
import { PlacementApplication, UserProfile } from "@/types/placement";

const inter = Inter({ subsets: ['latin'] });

export default async function TCSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch User & Application Data
    const { application, user }: { application: PlacementApplication, user: UserProfile | null } = await getOrCreatePlacementApplication("TCS");

    // Fallback data if something fails (should ideally redirect to login, but layout needs to be robust)
    const candidateId = application?.candidateId || "Generating...";
    const userName = user?.name || "Candidate";
    const userImage = user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

    return (
        <div className={`min-h-screen bg-gray-50 text-gray-900 ${inter.className}`}>
            {/* Fixed Corporate Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#181C2E] text-white z-50 shadow-md flex items-center px-6 justify-between">
                <div className="flex items-center gap-4">
                    {/* TCS Branding */}
                    <div className="flex items-center gap-4">
                        <div className="bg-white rounded px-2 py-1 h-9 w-24 flex items-center justify-center shadow-sm text-gray-900">
                            <div className="flex items-center gap-2 font-bold">
                                <Building2 className="w-5 h-5 text-[#0067b1]" />
                                <span>TCS</span>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col border-l border-gray-600 pl-4 py-0.5 justify-center">
                            <span className="font-bold text-sm tracking-wide leading-none text-white">iON</span>
                            <span className="text-[10px] text-gray-400 tracking-wider font-medium">Digital Assessment</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                    <span className="hidden md:block flex items-center gap-2">
                        System: <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Secure</span>
                    </span>
                    <span className="hidden sm:block">Candidate ID: <span className="text-white font-mono">{candidateId}</span></span>
                    <div className="flex items-center gap-3 bg-gray-800/50 py-1 pl-3 pr-1 rounded-full border border-gray-700">
                        <span className="text-xs text-white font-medium">{userName}</span>
                        <div className="relative w-7 h-7 rounded-full bg-gray-700 border border-gray-600 overflow-hidden shrink-0">
                            <Image
                                src={userImage}
                                alt="User"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-16 min-h-screen flex flex-col">
                {children}
            </main>

        </div>
    );
}
