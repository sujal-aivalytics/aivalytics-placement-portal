"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import {
  Flag,
  Lock,
  CheckCircle2,
  Star,
  Play,
  GraduationCap,
  Users,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';
import { COMPANY_TYPES, INTERVIEW_TYPES } from '@/lib/interview-constants';

export default function InterviewSuitePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Define steps
  const steps = [
    {
      id: "tcs_interviews",
      title: "Technical Audits",
      description: "Rigorous technical evaluations designed for institutional placement compliance.",
      status: "active",
      icon: GraduationCap,
      action: () => router.push(`/dashboard/interview-suite/start?company=${COMPANY_TYPES.TCS}&type=${INTERVIEW_TYPES.TECHNICAL}`)
    },
    {
      id: "wipro_interviews",
      title: "Management Protocol",
      description: "Analytical scenario discussions for leadership and behavioral compliance.",
      status: "locked",
      icon: Users,
      action: () => router.push(`/dashboard/interview-suite/start?company=${COMPANY_TYPES.WIPRO}&type=${INTERVIEW_TYPES.MANAGERIAL}`)
    },
    {
      id: "analytics",
      title: "Intelligence Dossier",
      description: "Comprehensive multi-parameter analysis of linguistic and technical performance.",
      status: "locked",
      icon: BarChart3,
      action: () => router.push('/dashboard/interview-suite/analytics')
    }
  ];

  return (
    <div className="min-h-screen bg-white p-8 md:p-12 animate-in fade-in duration-1000">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-20 px-6">
        <div className="space-y-4">
          <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Simulation Environment</p>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none">AI <span className="text-primary italic">Interview Suite</span></h1>
          <p className="text-gray-500 font-medium text-lg mt-4 max-w-2xl">High-fidelity behavioral and technical audit engine powered by neural analysis.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20 px-6">
        {/* Visual Roadmap Section */}
        <div className="flex-1 max-w-3xl relative">
          <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-gray-100" />

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="flex gap-12 group relative"
              >
                {/* Node Icon */}
                <div className="relative shrink-0">
                  {step.status === 'active' ? (
                    <div className="w-12 h-12 rounded-none bg-gray-900 border border-gray-900 shadow-2xl shadow-gray-900/20 flex items-center justify-center z-20 relative outline outline-8 outline-white">
                      <Flag className="w-5 h-5 text-primary fill-primary" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-none bg-gray-50 border border-gray-100 flex items-center justify-center z-20 relative font-black text-[10px] text-gray-400 uppercase tracking-widest outline outline-8 outline-white">
                      0{index + 1}
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <div className="flex-1">
                  {step.status === 'active' ? (
                    <div className="bg-white border border-gray-100 rounded-none p-10 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden aivalytics-card group-hover:-translate-y-2">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-none -mr-20 -mt-20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-6 bg-primary" />
                           <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                            {step.title}
                           </h3>
                        </div>
                        <Badge className="rounded-none bg-[#f0f9f8] text-primary border-primary/20 font-black uppercase tracking-widest text-[8px] px-3 py-1 shadow-none">Protocol Active</Badge>
                      </div>
                      
                      <p className="text-gray-500 font-medium text-lg mb-10 max-w-md leading-relaxed">
                        {step.description}
                      </p>

                      <Button
                        onClick={step.action}
                        className="h-16 px-10 rounded-none bg-gray-900 text-white hover:bg-black font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all border-b-4 border-primary group/btn"
                      >
                        <Play className="w-4 h-4 mr-4 fill-primary text-primary group-hover/btn:translate-x-1 transition-transform" />
                        Initialize Simulation
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={step.action}
                      className="bg-gray-50/30 border border-gray-50 rounded-none p-8 hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-500 flex items-center justify-between cursor-pointer group/locked"
                    >
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest group-hover/locked:text-gray-900 transition-colors uppercase">{step.title}</h3>
                        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">{step.description}</p>
                      </div>
                      <div className="w-10 h-10 rounded-none bg-gray-50 flex items-center justify-center border border-gray-100 group-hover/locked:border-primary/20 group-hover/locked:bg-primary/5 transition-all">
                        <Lock className="w-4 h-4 text-gray-200 group-hover/locked:text-primary transition-colors" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden lg:block flex-1 relative pt-10">
          <div className="relative w-full max-w-lg mx-auto aspect-square">
            {/* Architectural Background */}
            <div className="absolute inset-0 bg-gray-50 border border-gray-50 rounded-none overflow-hidden aivalytics-card pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] grayscale" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            </div>

            {/* Illustration */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-12">
              <div className="relative w-full h-full bg-white rounded-none shadow-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
                 <Image
                  src="https://img.freepik.com/free-vector/candidate-interviewed-job-office-by-human-resources-representative-flat-vector-illustration-hiring-process-concept-banner-website-design-landing-web-page_74855-25985.jpg"
                  alt="Audit Protocol Illustration"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gray-900/10 pointer-events-none group-hover:bg-transparent transition-all" />
              </div>
            </div>

            {/* Floating Indicators */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-12 -right-6 bg-gray-900 p-6 rounded-none shadow-2xl z-20 w-56 border-l-4 border-primary"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-2 rounded-none">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Pipeline</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Analysis Accuracy</span>
                    <span className="text-[10px] font-black text-primary italic">92%</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-none overflow-hidden">
                    <div className="h-full bg-primary w-[92%]"></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, delay: 1 }}
              className="absolute -bottom-8 -left-12 bg-white px-8 py-5 rounded-none shadow-2xl flex items-center gap-6 z-20 border border-gray-100"
            >
              <div className="bg-primary p-3 rounded-none shadow-xl shadow-primary/30">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Audit Score</p>
                <p className="text-xl font-black text-gray-900 tracking-tighter">ELITE GRADE</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
