"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Do not show navbar on auth or dashboard pages
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboardPage = pathname.startsWith("/dashboard");
  
  if (isAuthPage || isDashboardPage) return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Pricing", href: "/pricing" },
    { name: "Journal", href: "/journal" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black text-[#1A1A2E] tracking-tighter group-hover:text-[#00B4A0] transition-colors">
            AiValytics
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                aria-label={`${link.name} desktop`}
                className={cn(
                  "px-4 py-2 text-sm font-bold tracking-wide transition-all rounded-full hover:bg-[#00B4A0]/5",
                  isActive ? "text-[#00B4A0]" : "text-gray-600 hover:text-[#00B4A0]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Button asChild className="bg-[#00B4A0] hover:bg-[#00B4A0]/90 text-white font-bold rounded-full px-8 py-6 h-auto shadow-lg shadow-[#00B4A0]/20 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-wider text-xs">
            <Link href="/signup" className="flex items-center justify-center">GET CERTIFICATE</Link>
          </Button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="lg:hidden p-2 text-[#1A1A2E]" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-label={`${link.name} mobile`}
              className={cn(
                "text-lg font-extrabold transition-colors py-2 border-b border-gray-50",
                pathname === link.href ? "text-[#00B4A0]" : "text-[#1A1A2E]"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="w-full bg-[#00B4A0] hover:bg-[#00B4A0]/90 text-white font-bold rounded-full py-6 mt-4 shadow-xl shadow-[#00B4A0]/20 uppercase tracking-wider text-xs" onClick={() => setIsOpen(false)}>
            <Link href="/signup" className="flex items-center justify-center w-full">GET CERTIFICATE</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
