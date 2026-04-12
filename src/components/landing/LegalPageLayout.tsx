import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-44 pb-20 bg-[#F8FAFB] relative overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00B4A0]/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-4xl mx-auto px-8 relative z-10 text-center space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00B4A0] transition-colors font-bold text-[10px] uppercase tracking-widest mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-5xl lg:text-7xl font-black text-[#1A1A2E] tracking-tighter leading-tight">
            {title}
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-8">
          <div className="prose prose-lg prose-teal max-w-none prose-headings:text-[#1A1A2E] prose-headings:tracking-tighter prose-headings:font-black prose-p:text-gray-500 prose-p:font-medium prose-p:leading-relaxed">
            {children}
          </div>
          
          <div className="mt-24 p-12 bg-[#1A1A2E] rounded-[2.5rem] text-center space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#00B4A0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-3xl font-black text-white relative z-10">Have questions about our {title.toLowerCase()}?</h3>
            <p className="text-gray-400 font-medium relative z-10">Our support team is always here to help you understand our policies.</p>
            <div className="pt-4 relative z-10">
              <Link href="/contact">
                <Button className="bg-[#00B4A0] hover:bg-[#00B4A0]/90 text-white font-black rounded-full px-12 h-14 uppercase tracking-widest text-[10px] transition-all hover:-translate-y-1">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
