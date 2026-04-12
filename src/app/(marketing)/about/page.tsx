import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Target, Users, Zap, Award, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    { title: "Empowerment", desc: "Equipping students with skills that transform their career trajectory.", icon: <Zap /> },
    { title: "Integrity", desc: "Honesty and transparency in every mock, analysis, and report.", icon: <Shield /> },
    { title: "Precision", desc: "AI-driven diagnostics that pinpoints the exact areas for growth.", icon: <Target /> },
    { title: "Community", desc: "A network of thousands supporting each other in placement goals.", icon: <Users /> },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-44 pb-24 bg-[#EAF6F4] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00B4A0]/10 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1A1A2E]/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[#00B4A0] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            ✨ Our Story
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-[#1A1A2E] tracking-tighter leading-none">
            Empowering Your <br />
            <span className="text-[#00B4A0] italic">Career Success</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
            AiValytics was founded with a single mission: to revolutionize placement preparation through 
            the power of Artificial Intelligence and data-driven insights.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-[#00B4A0] rounded-[3rem] rotate-3 translate-x-4 translate-y-4" />
              <div className="absolute inset-0 bg-gray-100 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                   alt="Mission" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#00B4A0]/10 flex items-center justify-center text-[#00B4A0]">
                    <Award size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-[#1A1A2E]">95%</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h2 className="text-5xl font-black text-[#1A1A2E] leading-tight tracking-tighter">
                Bridging the Gap Between <br />
                <span className="text-[#00B4A0] italic">Education</span> & Careers
              </h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                We believe that every student has the potential to land their dream job. 
                However, traditional preparation methods often lack the personalization and 
                real-time feedback necessary for success in today's competitive landscape.
              </p>
              
              <div className="space-y-6">
                {[
                  "AI-Powered Personalized Learning Paths",
                  "MNC-Specific Interview Simulations",
                  "Real-Time Proctoring and Analytics",
                  "Industry-Recognized Certification Programs"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:border-[#00B4A0]/20 hover:bg-[#EAF6F4]/20 transition-all duration-300 group">
                    <CheckCircle2 size={24} className="text-[#00B4A0] group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[#1A1A2E] uppercase tracking-widest text-[10px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-32 bg-[#1A1A2E] text-white">
        <div className="max-w-7xl mx-auto px-8 text-center space-y-24">
          <div className="space-y-6">
            <h2 className="text-5xl font-black tracking-tighter">Our Core <span className="text-[#00B4A0] italic font-normal">Values</span></h2>
            <p className="text-gray-400 font-medium max-w-xl mx-auto">The principles that guide every feature we build and every program we offer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((v, i) => (
              <div key={i} className="p-12 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white transition-all duration-500 group relative overflow-hidden text-left shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#00B4A0] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 group-hover:text-[#1A1A2E] transition-colors">{v.title}</h4>
                <p className="text-gray-400 font-medium text-sm group-hover:text-gray-600 transition-colors leading-relaxed">
                  {v.desc}
                </p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B4A0]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-8 text-center space-y-12">
          <h2 className="text-5xl font-black text-[#1A1A2E] tracking-tighter leading-tight">
            Ready to Start Your <br />
            <span className="text-[#00B4A0] italic font-normal">Success</span> Journey?
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with AiValytics.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <Link href="/courses">
              <Button size="lg" className="rounded-full px-12 h-16 bg-[#00B4A0] hover:bg-[#00B4A0]/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-[#00B4A0]/20 transition-all hover:-translate-y-1 active:scale-95">
                Explore Courses
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-12 h-16 border-2 border-gray-100 hover:border-[#00B4A0] text-[#1A1A2E] hover:text-[#00B4A0] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/5 active:scale-95">
                Talk to Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
