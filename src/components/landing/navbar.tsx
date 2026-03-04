"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Clock, Facebook, Twitter, Instagram, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "All Courses", href: "#courses" },
        { name: "About", href: "#about" },
        { name: "Team", href: "#team" },
        { name: "Pricing", href: "#pricing" },
        { name: "Journal", href: "#journal" },
        { name: "Contact", href: "#contact" },
    ];

    return (
        <header className="fixed top-0 z-50 w-full">
            {/* MAIN NAVBAR */}
            <nav
                className={cn(
                    "w-full transition-all duration-300",
                    isScrolled
                        ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
                        : "bg-white/70 backdrop-blur-sm py-4"
                )}
            >
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
                    {/* LOGO */}
                    <Link href="/" className="flex flex-col group">
                        <span className="text-2xl font-black text-gray-800 leading-none group-hover:text-primary transition-colors tracking-tight">
                            AiValytics
                        </span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                            Online Education & Learning
                        </span>
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wide"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link href="/signup">
                            <Button className="rounded-none bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 transition-all relative overflow-hidden group">
                                <span className="relative z-10 uppercase tracking-widest text-xs">Get Certificate</span>
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                            </Button>
                        </Link>
                    </div>

                    {/* MOBILE TOGGLE */}
                    <div className="lg:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-800 hover:bg-gray-100">
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-base font-bold text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-50 uppercase tracking-widest text-xs"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-3 mt-4">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-center border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-xs">Log in</Button>
                            </Link>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full justify-center bg-primary hover:bg-primary/90 text-white font-bold h-12 uppercase tracking-widest text-xs">Get Certificate</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

