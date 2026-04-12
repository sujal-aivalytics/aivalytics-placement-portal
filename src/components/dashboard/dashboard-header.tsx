
"use client";

import React from "react";
import { Bell, Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
    setMobileOpen: (open: boolean) => void;
}

export function DashboardHeader({ setMobileOpen }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 bg-white/80 border-b border-gray-200 px-6 backdrop-blur-sm transition-all">
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden -ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setMobileOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="h-9 w-full rounded-full bg-gray-50 pl-9 border-gray-200 focus:bg-white transition-all hover:bg-white"
                    />
                </div>
            </div>

            <div className="flex-1" />

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
                <Button asChild className="hidden md:flex bg-[#00B4A0] hover:bg-[#00B4A0]/90 text-white font-bold rounded-full px-5 py-2 h-9 shadow-lg shadow-[#00B4A0]/20 transition-all hover:-translate-y-0.5 active:scale-95 uppercase tracking-wider text-[10px]">
                    <Link href="/signup">GET CERTIFICATE</Link>
                </Button>

                {/* Notifications Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700 rounded-full relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            Notifications
                            <span className="text-xs text-gray-400">3 new</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-64 overflow-y-auto">
                            <DropdownMenuItem className="flex flex-col items-start py-2 cursor-pointer">
                                <span className="text-sm font-medium">New MCQs Generated</span>
                                <span className="text-xs text-gray-500">Your AI-generated questions are ready</span>
                                <span className="text-xs text-gray-400 mt-1">2 min ago</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start py-2 cursor-pointer">
                                <span className="text-sm font-medium">Test Completed</span>
                                <span className="text-xs text-gray-500">You scored 85% in Aptitude Test</span>
                                <span className="text-xs text-gray-400 mt-1">1 hour ago</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start py-2 cursor-pointer">
                                <span className="text-sm font-medium">New Problem Added</span>
                                <span className="text-xs text-gray-500">Admin added a coding challenge</span>
                                <span className="text-xs text-gray-400 mt-1">3 hours ago</span>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="justify-center text-primary cursor-pointer">
                            <Link href="/dashboard/notifications">View All</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-gray-200 w-8 h-8 md:w-9 md:h-9 p-0">
                            <div className="bg-emerald-100 w-full h-full flex items-center justify-center text-emerald-700 font-bold text-xs">
                                JD
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/dashboard/profile" className="w-full">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/dashboard/settings" className="w-full">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
