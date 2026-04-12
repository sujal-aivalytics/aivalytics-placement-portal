import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { Search, BookOpen, GraduationCap, Settings, ShieldCheck } from "lucide-react";

export default function HelpPage() {
  const categories = [
    { icon: <BookOpen />, title: "Getting Started", count: "12 articles" },
    { icon: <GraduationCap />, title: "Learning Paths", count: "8 articles" },
    { icon: <Settings />, title: "Account & Billing", count: "15 articles" },
    { icon: <ShieldCheck />, title: "Security & Privacy", count: "6 articles" },
  ];

  return (
    <LegalPageLayout title="Help Center" lastUpdated="April 12, 2026">
      <div className="not-prose mb-12">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for articles, guides, and more..."
            className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl px-16 text-sm font-bold focus:outline-none focus:border-[#00B4A0]/30 transition-all"
          />
        </div>
      </div>

      <p>
        Welcome to the AiValytics Help Center. Here you'll find everything you need to 
        navigate our platform, understand your reports, and maximize your learning potential.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose mt-12">
        {categories.map((cat, i) => (
          <div key={i} className="p-8 bg-white border border-gray-100 rounded-3xl hover:border-[#00B4A0]/20 hover:shadow-xl hover:shadow-black/5 transition-all group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#00B4A0] group-hover:text-white transition-all">
              {cat.icon}
            </div>
            <h4 className="text-lg font-black text-[#1A1A2E] mt-6 mb-1">{cat.title}</h4>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{cat.count}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16">Popular Articles</h2>
      <ul>
        <li>How to schedule your first AI mock interview</li>
        <li>Understanding your detailed performance analytics</li>
        <li>Preparing for company-specific rounds (TCS, Wipro, etc.)</li>
        <li>Managing your subscription and career credits</li>
      </ul>
    </LegalPageLayout>
  );
}
