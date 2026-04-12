import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Zap, Star, Target, ArrowRight, Clock, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      icon: <Zap className="text-blue-500" />,
      price: "0",
      description: "Perfect for students just beginning their placement journey.",
      features: [
        "Access to Basic Aptitude Mocks",
        "Community Support Access",
        "Limited Performance Analysis",
        "Weekly Progress Reports",
        "Browser-based Monaco IDE"
      ],
      cta: "Start for Free",
      popular: false,
      color: "bg-blue-50",
    },
    {
      name: "Pro Placement",
      icon: <Star className="text-[#00B4A0]" />,
      price: "1,499",
      description: "Everything you need to crack top MNC interviews with confidence.",
      features: [
        "Unlimited Company-Specific Mocks",
        "Gemini AI Proctoring Enabled",
        "Advanced Coding Assessments",
        "Priority 1-on-1 Mentorship",
        "Premium Certification Programs",
        "Full Performance Analytics"
      ],
      cta: "Go Pro Now",
      popular: true,
      color: "bg-[#00B4A0]/10",
    },
    {
      name: "Elite Campus",
      icon: <Target className="text-purple-600" />,
      price: "4,999",
      description: "Comprehensive bootcamp for bulk preparation and group accounts.",
      features: [
        "Everything in Pro Placement",
        "Bulk Student Dashboards",
        "Group Video Mentoring",
        "Campus HR Reach-out Support",
        "Custom Mock Difficulty Engine",
        "Lifetime Access to Resources"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "bg-purple-50",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-44 pb-20 bg-[#EAF6F4] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00B4A0]/10 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A1A2E]/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[#00B4A0] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            💎 Transparent Plans
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-[#1A1A2E] tracking-tighter leading-none">
            Invest in Your <br />
            <span className="text-[#00B4A0] italic">Future Success</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your preparation stage. No hidden fees, just pure impact.
          </p>

          <div className="flex items-center justify-center gap-4 pt-8">
            <span className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest">Monthly</span>
            <div className="w-16 h-8 bg-[#00B4A0]/20 rounded-full relative p-1 cursor-pointer">
              <div className="w-6 h-6 bg-[#00B4A0] rounded-full absolute right-1" />
            </div>
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Yearly</span>
            <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ml-4">Save 40%</span>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((p, i) => (
            <div 
              key={i} 
              className={cn(
                "p-12 rounded-[4rem] border relative overflow-hidden transition-all duration-500 hover:-translate-y-4 shadow-sm hover:shadow-2xl flex flex-col h-full",
                p.popular ? "border-[#00B4A0] bg-[#1A1A2E] text-white" : "border-gray-100 bg-white text-[#1A1A2E]"
              )}
            >
              {p.popular && (
                <div className="absolute top-10 right-10 bg-[#00B4A0] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-[#00B4A0]/30 animate-pulse">
                  Most Popular
                </div>
              )}

              <div className="space-y-10 flex-1">
                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center transition-transform duration-500 hover:rotate-6", p.color)}>
                  {p.icon}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tight">{p.name}</h3>
                  <p className={cn("text-sm font-medium leading-relaxed", p.popular ? "text-gray-400" : "text-gray-500")}>
                    {p.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pt-4">
                  <span className="text-sm font-black uppercase tracking-widest opacity-50">₹</span>
                  <span className="text-6xl font-black tracking-tighter leading-none">{p.price}</span>
                  <span className="text-sm font-black uppercase tracking-widest opacity-50">/ One-time</span>
                </div>

                <ul className="space-y-6 pt-10">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-4 group">
                      <div className="mt-1">
                        <CheckCircle2 size={20} className={p.popular ? "text-[#00B4A0]" : "text-[#00B4A0]"} />
                      </div>
                      <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", p.popular ? "text-white/80 group-hover:text-white" : "text-[#1A1A2E]/80 group-hover:text-[#1A1A2E]")}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-16">
                <Link href={p.name === "Elite Campus" ? "/contact" : "/signup"}>
                  <Button className={cn(
                    "w-full h-16 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-[1.02] shadow-xl group",
                    p.popular ? "bg-[#00B4A0] hover:bg-white hover:text-[#1A1A2E] text-white shadow-[#00B4A0]/20" : "bg-[#1A1A2E] hover:bg-[#00B4A0] text-white"
                  )}>
                    {p.cta} <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <p className="text-[9px] font-black uppercase tracking-widest text-center mt-6 opacity-30 text-center mx-auto max-w-[200px]">30-Day Money Back Guarantee</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center flex flex-col lg:flex-row items-center justify-between gap-12 grayscale opacity-40">
           <span className="text-2xl font-black tracking-tight">TRUSTED BY 20,000+ STUDENTS GLOBALLY</span>
           <div className="flex flex-wrap justify-center gap-16 lg:gap-24 items-center">
              <Shield size={40} />
              <Zap size={40} />
              <Target size={40} />
              <Star size={40} />
           </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-32 max-w-3xl mx-auto px-8 text-center space-y-16">
        <h2 className="text-4xl font-black text-[#1A1A2E] tracking-tighter">Frequently <span className="text-[#00B4A0] italic font-normal">Asked</span> Questions</h2>
        <div className="space-y-8 text-left">
          {[
            { q: "Is the certification globally recognized?", a: "Yes, our certifications are trusted by HRs from TCS, Wipro, and other global MNCs." },
            { q: "Can I upgrade my plan later?", a: "Absolutely! You can upgrade from Starter to Pro at any time by paying the difference." },
          ].map((faq, i) => (
            <div key={i} className="p-10 bg-white border border-gray-100 rounded-[2.5rem] space-y-4 hover:shadow-xl transition-all shadow-sm">
               <div className="flex items-center gap-4 text-[#00B4A0]">
                 <HelpCircle size={20} />
                 <h4 className="text-lg font-black text-[#1A1A2E] tracking-tight">{faq.q}</h4>
               </div>
               <p className="text-gray-500 font-medium leading-relaxed pl-9">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
