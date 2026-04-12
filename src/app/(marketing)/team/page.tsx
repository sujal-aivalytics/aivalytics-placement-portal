import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Twitter, Mail, Star, Users, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  const team = [
    {
      name: "Dr. Arvind Sivakumar",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      bio: "Tech visionary with a passion for bridging the gap between talent and global opportunities.",
      socials: { linkedin: "#", twitter: "#", github: "#" },
    },
    {
      name: "Sanya Roy",
      role: "Lead Learning Strategist",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
      bio: "Educational designer specializing in adaptive learning and career transition frameworks.",
      socials: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Vikram Malhotra",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop",
      bio: "Architecting the AI engines that power our personalized analytics and proctoring systems.",
      socials: { linkedin: "#", github: "#" },
    },
    {
      name: "Anya Chen",
      role: "Head of Placement Relations",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
      bio: "Forging partnerships with top MNCs to ensure our mocks match actual hiring patterns.",
      socials: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Rohan Das",
      role: "Senior AI Researcher",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      bio: "Refining the performance analysis algorithms that identify student growth areas.",
      socials: { linkedin: "#", github: "#" },
    },
    {
      name: "Maya Patel",
      role: "Lead Content Architect",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
      bio: "Curating the industry-leading question banks and company-specific preparation kits.",
      socials: { linkedin: "#", twitter: "#" },
    },
  ];

  return (
    <main className="bg-[#EAF6F4]/50 min-h-screen pt-44 pb-32">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B4A0]/10 border border-[#00B4A0]/20 rounded-full text-[#00B4A0] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              👥 Experts Behind Success
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-[#1A1A2E] tracking-tighter leading-none">
              Meet the <span className="text-[#00B4A0] italic">Architects</span> <br />
              of Your Career
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
              Our team consists of industry veterans, AI researchers, and career experts 
              dedicated to creating the world's most advanced placement preparation platform.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/about">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 border-2 border-white bg-white hover:border-[#00B4A0] text-[#1A1A2E] hover:text-[#00B4A0] font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 transition-all">
                Our Story
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-10 h-16 bg-[#00B4A0] hover:bg-[#00B4A0]/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#00B4A0]/20 active:scale-95 transition-all">
                Join our mission
              </Button>
            </Link>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {team.map((member, i) => (
            <div 
              key={i} 
              className="group relative"
            >
              <div className="relative aspect-square mb-10 overflow-hidden rounded-[3rem] border-[12px] border-white shadow-2xl transition-transform duration-700 group-hover:-translate-y-4 group-hover:rotate-2">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                />
                
                {/* Social Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex justify-center gap-6">
                    {member.socials.linkedin && (
                      <Link href={member.socials.linkedin} className="text-white hover:text-[#00B4A0] transition-colors"><Linkedin size={24} /></Link>
                    )}
                    {member.socials.twitter && (
                      <Link href={member.socials.twitter} className="text-white hover:text-[#00B4A0] transition-colors"><Twitter size={24} /></Link>
                    )}
                    {member.socials.github && (
                      <Link href={member.socials.github} className="text-white hover:text-[#00B4A0] transition-colors"><Github size={24} /></Link>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 px-4 text-center lg:text-left">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-[#1A1A2E] tracking-tight group-hover:text-[#00B4A0] transition-colors font-bold uppercase tracking-widest text-xs">{member.role}</h3>
                  <h2 className="text-4xl font-extrabold text-[#1A1A2E] leading-tight font-black text-2xl tracking-tighter">{member.name}</h2>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Culture Section */}
        <section className="mt-48 py-32 bg-[#1A1A2E] rounded-[4rem] text-center text-white overflow-hidden relative shadow-3xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00B4A0]/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-8 space-y-12">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
              Be Part of our <br />
              <span className="text-[#00B4A0] italic font-normal">Next Big Move</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
              We are always looking for passionate people who want to disrupt the way skill-building and career transitions happen.
            </p>
            <div className="flex flex-wrap justify-center gap-12 pt-10">
              <div className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-[#00B4A0] group-hover:bg-[#00B4A0] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                  <Zap size={32} />
                </div>
                <span className="font-extrabold uppercase tracking-widest text-xs">Fast Growth</span>
              </div>
              <div className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-[#00B4A0] group-hover:bg-[#00B4A0] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                  <Globe size={32} />
                </div>
                <span className="font-extrabold uppercase tracking-widest text-xs">Remote Native</span>
              </div>
              <div className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-[#00B4A0] group-hover:bg-[#00B4A0] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                  <Star size={32} />
                </div>
                <span className="font-extrabold uppercase tracking-widest text-xs">Premium Impact</span>
              </div>
            </div>
            <div className="pt-12">
              <Link href="/careers">
                <Button size="lg" className="bg-white text-[#1A1A2E] hover:bg-[#00B4A0] hover:text-white font-black px-12 h-20 rounded-full transition-all duration-300 uppercase tracking-[0.2em] shadow-2xl active:scale-95">
                  View Open Roles <ArrowRight size={20} className="ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
