import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock, Star, Target, Zap, Filter, Search, Tag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function JournalPage() {
  const blogs = [
    {
      title: "Cracking the TCS NQT: 2026 Strategy Guide",
      excerpt: "Deep dive into the latest changes in the TCS exam pattern and how AI can help you prepare faster.",
      date: "March 28, 2026",
      readTime: "12 min read",
      category: "MNC Patterns",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
      featured: true,
    },
    {
      title: "Top 5 Mistakes Students Make in Mock Tests",
      excerpt: "Learn why most candidates fail their initial mocks and how to fix your strategy before the real exam.",
      date: "March 25, 2026",
      readTime: "8 min read",
      category: "Preparation Tips",
      image: "https://images.unsplash.com/photo-1454165833767-13143895960b?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "How Gemini AI is Revolutionizing Proctoring",
      excerpt: "Exploring the tech behind our real-time proctoring systems and why it ensures a fair testing environment.",
      date: "March 22, 2026",
      readTime: "10 min read",
      category: "AI Technology",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "The Future of Python in Enterprise Placements",
      excerpt: "Why Python has become the go-to language for top-tier companies and how you can master its data structures.",
      date: "March 18, 2026",
      readTime: "15 min read",
      category: "Coding",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Wipro Elite Mock Results: A Statistical Review",
      excerpt: "Analyzing data from 50,000 mock tests to identify common weak points and success patterns.",
      date: "March 15, 2026",
      readTime: "20 min read",
      category: "Data Analysis",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    },
    {
      title: "Stress Management for Interview Candidates",
      excerpt: "Techniques to manage anxiety and perform your best when the pressure is high during real-time assessments.",
      date: "March 10, 2026",
      readTime: "7 min read",
      category: "Career Advice",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  return (
    <main className="min-h-screen bg-[#EAF6F4]/20 pt-44 pb-32">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-3xl space-y-8">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B4A0]/10 border border-[#00B4A0]/20 rounded-full text-[#00B4A0] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
               📰 Career Insights
             </div>
             <h1 className="text-6xl lg:text-8xl font-black text-[#1A1A2E] tracking-tighter leading-none">
               The Career <br />
               <span className="text-[#00B4A0] italic">Journal</span>
             </h1>
             <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed">
               Expert advice, latest trends, and comprehensive guides curated by the AiValytics team. 
               Stay ahead of the curve.
             </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96 flex items-center">
              <Search className="absolute left-6 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="SEARCH ARTICLES..." 
                className="pl-16 pr-8 py-5 w-full bg-gray-50 rounded-[2rem] focus:outline-none focus:bg-white border border-transparent focus:border-gray-200 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-gray-400"
              />
            </div>
            <Button className="bg-[#00B4A0] p-6 h-16 w-16 rounded-[2rem] shadow-lg shadow-[#00B4A0]/20">
              <Filter size={24} />
            </Button>
          </div>
        </div>

        {/* Featured Post */}
        {blogs.find(b => b.featured) && (
          <div className="mb-24 group relative overflow-hidden rounded-[4rem] bg-white border border-gray-100 shadow-2xl transition-all duration-500 hover:shadow-[#00B4A0]/10">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                <img 
                  src={blogs.find(b => b.featured)?.image} 
                  alt="Featured Post" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-10 left-10">
                  <span className="bg-[#1A1A2E] text-white text-[10px] font-black rounded-full px-6 py-2 uppercase tracking-widest shadow-2xl">
                    Featured Article
                  </span>
                </div>
              </div>
              <div className="p-16 lg:p-24 space-y-10 flex flex-col justify-center">
                <div className="flex items-center gap-6 text-[10px] font-black text-[#00B4A0] uppercase tracking-[0.2em] font-bold">
                  <span className="flex items-center gap-2 bg-[#00B4A0]/5 px-4 py-1.5 rounded-full"><Tag size={12} /> {blogs.find(b => b.featured)?.category}</span>
                  <span className="flex items-center gap-2 text-gray-400"><Clock size={12} /> {blogs.find(b => b.featured)?.readTime}</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black text-[#1A1A2E] leading-tight tracking-tighter group-hover:text-[#00B4A0] transition-colors">
                  {blogs.find(b => b.featured)?.title}
                </h2>
                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                  {blogs.find(b => b.featured)?.excerpt}
                </p>
                <div className="pt-6">
                  <Link href="#">
                    <Button size="lg" className="rounded-full px-12 h-20 bg-[#1A1A2E] hover:bg-[#00B4A0] text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#1A1A2E]/20 group/btn">
                      Read Article <ArrowRight size={18} className="ml-3 group-hover/btn:translate-x-3 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.filter(b => !b.featured).map((blog, i) => (
            <div 
              key={i} 
              className="group bg-white rounded-[3rem] overflow-hidden border border-gray-100/50 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-[#00B4A0]/10 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-white/80 backdrop-blur-md text-[#1A1A2E] text-[9px] font-black rounded-full px-4 py-1.5 uppercase tracking-widest shadow-lg">
                    {blog.date}
                  </span>
                </div>
              </div>

              <div className="p-12 space-y-6">
                 <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                   <span className="text-[#00B4A0]">{blog.category}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-200" />
                   <span className="text-gray-400">{blog.readTime}</span>
                 </div>

                 <h3 className="text-2xl lg:text-3xl font-black text-[#1A1A2E] leading-snug group-hover:text-[#00B4A0] transition-colors">{blog.title}</h3>

                 <p className="text-gray-500 font-medium text-sm leading-relaxed line-clamp-3">
                   {blog.excerpt}
                 </p>

                 <div className="pt-6 border-t border-gray-50">
                    <Link href="#" className="flex items-center gap-2 text-[#1A1A2E] font-black uppercase tracking-widest text-[9px] group/link">
                      Read Full Article <ArrowRight size={14} className="group-hover/link:translate-x-3 transition-transform duration-300" />
                    </Link>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-24 flex justify-center">
           <Button size="lg" className="rounded-full px-14 h-16 bg-white text-[#1A1A2E] border-2 border-gray-100 hover:border-[#00B4A0] hover:text-[#00B4A0] font-black uppercase tracking-widest text-[10px] shadow-sm transition-all active:scale-95">
              Load More Postings
           </Button>
        </div>
      </div>
    </main>
  );
}
