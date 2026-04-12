import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Shield, Star, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-44 pb-32">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="max-w-3xl space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B4A0]/10 border border-[#00B4A0]/20 rounded-full text-[#00B4A0] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                📞 Get in Touch
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-[#1A1A2E] tracking-tighter leading-none">
                Let's <span className="text-[#00B4A0] italic">Connect</span> <br />
                on Your Future
              </h1>
              <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed">
                Have questions about our mocks, pricing, or enterprise solutions? 
                Our team is here to help you scale your preparation.
              </p>
           </div>

           <div className="flex flex-col gap-6 lg:text-right">
              <div className="space-y-1">
                <p className="text-xs font-black text-[#00B4A0] uppercase tracking-widest">Global Support</p>
                <h3 className="text-4xl font-extrabold text-[#1A1A2E] tracking-tighter leading-none whitespace-nowrap">24/7 Availability</h3>
              </div>
              <p className="text-gray-400 font-medium text-sm">Response time: Usually under 2 hours.</p>
           </div>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-12">
            <div className="p-12 lg:p-20 bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-black/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B4A0]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               
               <form className="space-y-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="ALEX CHEN" 
                        className="w-full h-16 bg-gray-50 border border-transparent rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-[#00B4A0]/30 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="ALEX@EXAMPLE.AI" 
                        className="w-full h-16 bg-gray-50 border border-transparent rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-[#00B4A0]/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</label>
                    <select className="w-full h-16 bg-gray-50 border border-transparent rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-[#00B4A0]/30 transition-all">
                      <option>GENERAL INQUIRY</option>
                      <option>UPGRADE ACCOUNT</option>
                      <option>ENTERPRISE SOLUTIONS</option>
                      <option>TECHNICAL SUPPORT</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Message</label>
                    <textarea 
                      rows={6}
                      placeholder="HOW CAN WE HELP YOU SUCCEED?" 
                      className="w-full bg-gray-50 border border-transparent rounded-[2.5rem] p-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-[#00B4A0]/30 transition-all resize-none"
                    />
                  </div>

                  <Button className="w-full h-20 bg-[#1A1A2E] hover:bg-[#00B4A0] text-white font-black uppercase tracking-[0.2em] text-xs rounded-3xl transition-all duration-300 shadow-2xl shadow-black/20 flex items-center justify-center gap-4 group/btn active:scale-[0.98]">
                    Send Message Now <Send size={20} className="group-hover/btn:translate-x-3 group-hover/btn:-translate-y-3 transition-transform duration-500" />
                  </Button>
               </form>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-5 space-y-16 py-12">
            <div className="space-y-12">
               <h3 className="text-4xl font-black text-[#1A1A2E] tracking-tight">Direct <span className="text-[#00B4A0] italic">Channels</span></h3>
               
               <div className="space-y-10">
                  {[
                    { icon: <Mail size={24} />, title: "Official Email", value: "HELLO@AIVALYTICS.AI", desc: "For general support and inquiries." },
                    { icon: <Phone size={24} />, title: "Contact Phone", value: "+91 98765 43210", desc: "Mon-Fri from 9am to 6pm IST." },
                    { icon: <MapPin size={24} />, title: "HQ Office", value: "BANGALORE, INDIA", desc: "Corporate headquarters." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-8 group">
                       <div className="w-16 h-16 rounded-[1.5rem] bg-[#00B4A0]/10 flex items-center justify-center text-[#00B4A0] group-hover:bg-[#00B4A0] group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
                         {item.icon}
                       </div>
                       <div className="space-y-2">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.title}</h5>
                          <h4 className="text-2xl font-black text-[#1A1A2E] tracking-tight">{item.value}</h4>
                          <p className="text-gray-500 font-medium text-xs">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-12 bg-[#1A1A2E] rounded-[3rem] text-white space-y-8 relative overflow-hidden group shadow-3xl shadow-black/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B4A0] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-20" />
               <h3 className="text-2xl font-black tracking-tight relative z-10">Follow Our <span className="text-[#00B4A0]">Update</span> Feed</h3>
               <div className="flex gap-6 relative z-10">
                  {[
                    { icon: <Linkedin size={24} />, href: "#" },
                    { icon: <Twitter size={24} />, href: "#" },
                    { icon: <Instagram size={24} />, href: "#" },
                    { icon: <Globe size={24} />, href: "#" },
                  ].map((social, i) => (
                    <Link 
                      key={i} 
                      href={social.href}
                      className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#00B4A0] hover:text-white transition-all duration-300 border border-white/5"
                    >
                      {social.icon}
                    </Link>
                  ))}
               </div>
            </div>

            {/* Support Badges */}
            <div className="grid grid-cols-2 gap-8 pt-4">
               <div className="p-8 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center gap-4 hover:border-[#00B4A0]/30 transition-all group shadow-sm">
                  <Shield size={32} className="text-[#00B4A0] group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">SECURE DATA HANDLING</span>
               </div>
               <div className="p-8 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center gap-4 hover:border-[#00B4A0]/30 transition-all group shadow-sm">
                  <Star size={32} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">TOP-RATED SUPPORT</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
