import { Button } from "@/components/ui/button";
import { Code2, Terminal, Cpu, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CodingPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-44 pb-24 bg-[#EAF6F4] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00B4A0]/10 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1A1A2E]/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[#00B4A0] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            💻 Development In Progress
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-[#1A1A2E] tracking-tighter leading-none">
            Level Up Your <br />
            <span className="text-[#00B4A0] italic">Coding Prowess</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
            From DSA to System Design, we're building a comprehensive coding platform 
            with AI-guided problem solving and real-time execution.
          </p>
          
          <div className="pt-8">
             <Link href="/">
              <Button size="lg" className="rounded-full px-12 h-16 bg-[#00B4A0] hover:bg-[#00B4A0]/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-[#00B4A0]/20 transition-all hover:-translate-y-1 active:scale-95">
                Join Waitlist
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Terminal />, title: "DSA Expert", desc: "Interactive paths for Arrays, Linked Lists, Trees, and Graphs." },
              { icon: <Cpu />, title: "System Design", desc: "Master scaling, load balancing, and high-level architecture." },
              { icon: <Code2 />, title: "Language Packs", desc: "Deep dives into Java, Python, C++, and Modern JavaScript." },
            ].map((f, i) => (
              <div key={i} className="p-12 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:border-[#00B4A0]/20 hover:bg-white transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-[#00B4A0]/10 flex items-center justify-center text-[#00B4A0] mb-8 group-hover:bg-[#00B4A0] group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h4 className="text-2xl font-black text-[#1A1A2E] mb-4">{f.title}</h4>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
