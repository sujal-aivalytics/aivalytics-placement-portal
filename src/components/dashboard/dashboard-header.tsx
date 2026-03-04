
"use client";

import React from "react";
import { Bell, Menu, Search, User } from "lucide-react";
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
            <div className="flex items-center gap-2 md:gap-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700 rounded-full">
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-gray-200 w-8 h-8 md:w-9 md:h-9">
                            <div className="bg-emerald-100 w-full h-full flex items-center justify-center text-emerald-700 font-bold text-xs">
                                JD
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
