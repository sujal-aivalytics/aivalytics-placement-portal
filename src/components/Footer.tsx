"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star, Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Do not show footer on auth or dashboard pages
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboardPage = pathname.startsWith("/dashboard");

  if (isAuthPage || isDashboardPage) return null;

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00B4A0]/5 rounded-full blur-[100px] -mt-48" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link href="/" className="flex flex-col group">
              <span className="text-3xl font-black text-[#1A1A2E] tracking-tighter group-hover:text-[#00B4A0] transition-colors">
                AiValytics
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
                Advanced Skill Builder
              </span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
              Master the skills required to crack your dream MNC placements. 
              AI-driven mocks, real-time feedback, and company-specific preparation.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Linkedin size={20} />, href: "#" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Instagram size={20} />, href: "#" },
                { icon: <Facebook size={20} />, href: "#" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href}
                  className="w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#00B4A0] hover:text-white hover:border-[#00B4A0] transition-all duration-300 shadow-sm"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#1A1A2E] font-black text-sm uppercase tracking-widest mb-10">Quick Navigation</h4>
            <ul className="space-y-6">
              {[
                { name: "Home", href: "/" },
                { name: "Mock Tests", href: "/courses" },
                { name: "Aptitude", href: "/aptitude" },
                { name: "Coding", href: "/coding" },
                { name: "Career Blog", href: "/journal" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-500 font-bold hover:text-[#00B4A0] transition-colors text-xs uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00B4A0] scale-0 group-hover:scale-100 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="text-[#1A1A2E] font-black text-sm uppercase tracking-widest mb-10">Support & Legal</h4>
            <ul className="space-y-6">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Terms of Service", href: "/terms-of-use" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Refund Policy", href: "/refunds" },
                { name: "Cookie Policy", href: "/cookies" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-500 font-bold hover:text-[#00B4A0] transition-colors text-xs uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00B4A0] scale-0 group-hover:scale-100 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-10">
            <h4 className="text-[#1A1A2E] font-black text-sm uppercase tracking-widest mb-10">Stay Informed</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-500 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#00B4A0] group-hover:bg-[#00B4A0] group-hover:text-white transition-colors duration-300 shadow-sm border border-gray-100">
                  <Mail size={18} />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest">hello@aivalytics.ai</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#00B4A0] group-hover:bg-[#00B4A0] group-hover:text-white transition-colors duration-300 shadow-sm border border-gray-100">
                  <MapPin size={18} />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest">Silicon Valley, CA</span>
              </div>
            </div>
            
            <div className="pt-4 relative flex">
              <input 
                type="email" 
                placeholder="YOUR EMAIL"
                className="w-full bg-gray-50 border border-gray-100 rounded-full h-14 px-6 text-xs font-black focus:outline-none focus:border-[#00B4A0]/30 transition-all placeholder:text-gray-400"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#00B4A0] text-white px-6 rounded-full font-black text-[10px] uppercase tracking-widest hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg shadow-[#00B4A0]/20">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            © {currentYear} AiValytics. Built with precision for premium results.
          </p>
          <div className="flex gap-8">
            <Link href="/security" className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#00B4A0] transition-colors">Security</Link>
            <Link href="/support" className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#00B4A0] transition-colors">Support</Link>
            <Link href="/contact" className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#00B4A0] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
