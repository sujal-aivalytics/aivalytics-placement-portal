
"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
// import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    const isTestPage = pathname?.startsWith('/dashboard/test');
    const isMockRoundPage = pathname?.includes('/dashboard/placement/mock-drives/') && pathname?.includes('/round/');
    const hideSidebar = isTestPage || isMockRoundPage;

    return (
        <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden text-neutral-900">
            {/* Sidebar - Fixed on desktop, sliding on mobile under layout control */}
            {!hideSidebar && (
                <Sidebar
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    role={session?.user?.role}
                    user={session?.user}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden transition-all duration-300">
                <div className={`transition-all duration-300 min-h-screen flex flex-col ${!hideSidebar ? (collapsed ? 'lg:pl-28' : 'lg:pl-72') : ''}`}>
                    {/* <DashboardHeader setMobileOpen={setMobileOpen} /> */}

                    <div className="flex-1 w-full relative p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
