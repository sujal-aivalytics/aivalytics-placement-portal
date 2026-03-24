"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star, Shield, Zap, Target, BookOpen, Clock, TrendingUp, Award, Laptop, Users, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { SiteLoader } from "@/components/landing/site-loader";
import { ScrollAnimation } from "@/components/landing/scroll-animation";
import LifeAtAiValytics from "@/components/landing/life-at-aivalytics";
import MentorsSection from "@/components/landing/mentors-section";
import SubjectsGrid from "@/components/landing/subjects-grid";
import { WhyChooseUsSlideshow } from "@/components/landing/why-choose-us-slideshow";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/landing/background-beams";
import { CompanyTicker } from "@/components/landing/company-ticker";
import { JourneyLine } from "@/components/landing/journey-line";

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary/30 selection:text-primary">
      <SiteLoader />
      <Navbar />

      <main className="relative bg-white min-h-screen overflow-hidden">
        {/* HERO SECTION - RE-DESIGNED FOR AiValytics */}
        <section className="relative pt-44 pb-20 lg:pt-56 lg:pb-40 bg-[#f0f9f8] overflow-hidden">
          {/* Background Decorative Blobs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-blob" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -ml-40 -mb-40 animate-blob animation-delay-2000" />

          <div className="container mx-auto px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
              {/* Left Content */}
              <div className="w-full lg:w-[650px] space-y-8 text-center lg:text-left transition-all duration-700">
                <ScrollAnimation>
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    AI-Powered Placement Preparation
                  </p>
                  <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    Crack Your Dream <br />
                    <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">MNC Interview</span>
                  </h1>

                  <p className="text-lg lg:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mt-8 animate-in fade-in slide-in-from-bottom-12 duration-1200">
                    The only platform offering company-specific mock tests for 
                    <span className="text-gray-900 font-bold"> TCS, Wipro, and Infosys </span> 
                    with Gemini AI-driven proctoring and real-time coding assessments.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-12 animate-in fade-in slide-in-from-bottom-16 duration-1400">
                    <Link href="/signup">
                      <Button size="lg" className="rounded-none px-10 h-16 bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl hover:shadow-primary/30 active:scale-95 group relative overflow-hidden">
                        <span className="relative z-10 flex items-center">
                          Get Started Now! <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      </Button>
                    </Link>
                    <Link href="/courses">
                      <Button size="lg" variant="outline" className="rounded-none px-10 h-16 border-white bg-white hover:bg-gray-50 text-primary font-black text-sm uppercase tracking-widest shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-95 group border-2 hover:border-primary/20">
                        View Mock Exams <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </ScrollAnimation>
              </div>

              {/* Right Content - Visual Elements */}
              <div className="w-full lg:flex-1 relative">
                <ScrollAnimation delay={0.2} className="relative z-10 flex justify-end">
                  <div className="relative w-full max-w-[680px]">
                    {/* The image should look like the one in AiValytics */}
                    <img
                      src="/images/image copy 2.png" 
                      alt="AiValytics Student"
                      className="w-full h-auto drop-shadow-[0_35px_60px_rgba(0,0,0,0.1)] rounded-[2rem] transform lg:translate-x-10 pointer-events-none transition-transform duration-700 hover:scale-105"
                    />
                    
                    {/* Floating Experience Badge */}
                    <div className="absolute top-20 -left-10 lg:-left-20 bg-white p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-50 animate-float hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-shadow duration-500 cursor-pointer group">
                       <p className="text-4xl font-black text-primary group-hover:scale-110 transition-transform duration-300">95%</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Placement Rate</p>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </section>

        {/* COMPANY TICKER (Refined for light theme) */}
        <div className="py-12 bg-white border-y border-gray-50 overflow-hidden">
          <CompanyTicker />
        </div>

        {/* PREMIUM LEARNING SECTION - LIGHT THEME */}
        <section className="py-24 lg:py-32 relative bg-white" id="how-it-works">
          <div className="container mx-auto px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              {/* Left Image Column */}
              <div className="w-full lg:w-1/2 relative">
                <ScrollAnimation delay={0.1} className="relative">
                  <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-gray-50 shadow-[0_40px_80px_rgba(0,0,0,0.06)] group">
                    <img
                      src="/jira/WEBP/report-learn-as-you-deliver-2.webp"
                      alt="Learning Experience"
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                </ScrollAnimation>
              </div>

              {/* Right Content Column */}
              <div className="w-full lg:w-[600px] space-y-10">
                <ScrollAnimation>
                  <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] tracking-[0.2em] uppercase">
                    ✨ Technical Excellence
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] pt-6">
                    Master Your <br />
                    <span className="text-primary italic">Career Path</span> with AI
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-500 leading-relaxed font-medium mt-6">
                    Unlock your potential with our AI-driven placement platform.
                    Tailored resources, real-time feedback, and advanced coding environments.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10">
                    {[
                      { title: "Company-Specific Logic", icon: <Target className="w-6 h-6 text-primary" />, color: "bg-primary/10" },
                      { title: "Gemini AI Proctoring", icon: <Shield className="w-6 h-6 text-blue-500" />, color: "bg-blue-50" },
                      { title: "Performance Analytics", icon: <TrendingUp className="w-6 h-6 text-orange-500" />, color: "bg-orange-50" },
                      { title: "Browser-based Monaco IDE", icon: <Laptop className="w-6 h-6 text-emerald-500" />, color: "bg-emerald-50" },
                    ].map((feat) => (
                      <div key={feat.title} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-primary/30 group">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 shadow-inner", feat.color)}>
                          {feat.icon}
                        </div>
                        <span className="font-bold text-gray-800 text-sm tracking-tight">{feat.title}</span>
                      </div>
                    ))}
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </section>

        {/* SUBJECTS GRID */}
        <div className="bg-[#f0f9f8] py-24">
           <SubjectsGrid />
        </div>

        {/* WHY CHOOSE US - LIGHT REFINEMENT */}
        <section className="py-24 lg:py-32 relative bg-white" id="features">
          <div className="container mx-auto px-8">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
              {/* Left Column */}
              <div className="w-full lg:w-[700px] space-y-10">
                <ScrollAnimation>
                  <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] tracking-[0.2em] uppercase">
                    ★ Why Choose Us
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] pt-6">
                    Experience Complete <br />
                    <span className="text-primary italic">Preparation</span>
                  </h2>
                  <p className="text-xl text-gray-500 font-medium max-w-lg mt-8 leading-relaxed">
                    Join a community of thousands of students achieving their dream placement goals with our advanced engine.
                  </p>
                </ScrollAnimation>

                <ScrollAnimation delay={0.2} className="w-full pt-10">
                  <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.04)]">
                    <WhyChooseUsSlideshow />
                  </div>
                </ScrollAnimation>
              </div>

              {/* Right Column: Grid */}
              <div className="w-full lg:w-1/2 pt-12 lg:pt-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { title: "AI Analysis Engine", icon: <Shield className="w-8 h-8 text-primary" />, desc: "Real-time performance tracking and personalized roadmaps." },
                    { title: "Company Patterns", icon: <Zap className="w-8 h-8 text-amber-500" />, desc: "Exact test patterns for top MNCs like TCS & Infosys." },
                    { title: "Smart Feedback", icon: <Star className="w-8 h-8 text-rose-500" />, desc: "Instant, actionable insights on your weak areas." },
                    { title: "Real-Time Sims", icon: <Target className="w-8 h-8 text-indigo-500" />, desc: "Experience the actual pressure of exam environments." },
                  ].map((item, idx) => (
                    <ScrollAnimation key={idx} delay={idx * 0.1}>
                      <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 hover:border-primary/30 transition-all duration-500 h-full shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center mb-8 border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          {item.icon}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-4">{item.title}</h4>
                        <p className="text-gray-500 font-medium leading-relaxed text-sm">{item.desc}</p>
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MENTORS SECTION
        <div className="bg-[#f0f9f8] py-24">
           <MentorsSection />
        </div> */}

        {/* CTA BANNER - AiValytics COLOR */}
        <section className="py-24 mt-20 container mx-auto px-8 relative z-10">
          <ScrollAnimation>
            <div className="bg-primary rounded-[4rem] p-16 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between text-white shadow-3xl">
              <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64" />
              
              <div className="relative z-10 w-full lg:w-3/5 space-y-12 text-center lg:text-left">
                <h2 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                  Start Your <br />
                  Success Story <br />
                  <span className="opacity-60 italic text-white/80">Today</span>
                </h2>
                <p className="text-xl lg:text-2xl text-white/80 font-medium max-w-xl mx-auto lg:mx-0">
                  Join thousands of students who have cracked their dream companies with AiValytics's advanced engine.
                </p>
                <div className="pt-6">
                  <Link href="/signup">
                    <Button size="lg" className="rounded-none px-14 h-20 bg-white text-primary hover:bg-gray-100 font-black text-lg uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
                      Get Started Now
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="w-full lg:w-2/5 mt-20 lg:-mt-20 relative flex justify-center lg:justify-end ">
                <img
                  src="/images/image copy.png"
                  alt="Student Success"
                  className="relative h-[350px] lg:h-[600px] w-auto object-contain z-10 scale-[1.3] lg:scale-[1.8] translate-y-10 lg:translate-x-10 drop-shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
                />
              </div>
            </div>
          </ScrollAnimation>
        </section>

        {/* <div className="pb-32">
           <LifeAtAiValytics />
        </div> */}
      </main>

      {/* FOOTER - LIGHT THEME */}
      <footer className="bg-white text-gray-900 py-32 relative overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-12">
            <div className="space-y-10">
              <Link href="/" className="flex flex-col group">
                <span className="text-3xl font-black text-gray-900 leading-none group-hover:text-primary transition-colors tracking-tighter">AiValytics</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Placement Preparation Platform</span>
              </Link>
              <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                Empowering your career with AI-driven aptitude preparation, real-time analytics, and personalized mentorship.
              </p>
              <div className="flex gap-4 pt-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <div key={social} className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer group shadow-sm">
                    <Star className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-10">
              <h5 className="text-xl font-black text-gray-900 mb-10 uppercase tracking-widest text-sm">Navigation</h5>
              <ul className="space-y-6">
                {['Home', 'Mock Tests', 'Aptitude', 'Coding', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-gray-500 font-bold hover:text-primary transition-colors flex items-center gap-3 group uppercase tracking-widest text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-xl font-black text-gray-900 mb-10 uppercase tracking-widest text-sm">Legal</h5>
              <ul className="space-y-6">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-gray-500 font-bold hover:text-primary transition-colors flex items-center gap-3 group uppercase tracking-widest text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <h5 className="text-xl font-black text-gray-900 mb-10 uppercase tracking-widest text-sm">Newsletter</h5>
              <p className="text-gray-500 font-medium leading-relaxed">Subscribe to get the latest updates and job alerts directly to your inbox.</p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-16 bg-gray-50 border border-gray-100 rounded-none px-6 font-bold text-gray-900 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-400"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-white px-8 rounded-none font-black transition-all shadow-xl shadow-primary/20 uppercase tracking-[0.2em] text-[10px]">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="mt-32 pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-10">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} AiValytics. Powered by Students.
            </p>
            <div className="flex gap-10 text-xs font-black text-gray-400 uppercase tracking-widest">
              <Link href="#" className="hover:text-primary transition-colors">Support</Link>
              <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
              <Link href="#" className="hover:text-primary transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
