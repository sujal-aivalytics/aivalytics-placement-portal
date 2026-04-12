import { Button } from "@/components/ui/button";
import { adminDb } from "@/lib/firebase-config";
import { ArrowRight, BookOpen, Star, Clock, Filter, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Premium Courses | AiValytics",
  description: "Explore our dynamic learning ecosystem from foundation to advanced MNC-specific training.",
};

export default async function CoursesPage() {
  let courses = [];
  
  try {
    // Fetch all courses (Tests with type 'course' or 'topic')
    const snapshot = await adminDb.collection("Test").orderBy("createdAt", "desc").get();
    const dbCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

    // Map existing DB data
    if (dbCourses.length > 0) {
      courses = dbCourses.map(c => ({
        id: c.id,
        title: c.title || "Untitled Course",
        category: c.type?.toUpperCase() || "Curriculum",
        duration: c.duration ? `${c.duration}m` : "45m",
        students: "1k+", 
        rating: (4 + Math.random()).toFixed(1),
        price: c.price || "Free",
        image: c.image || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
      }));
    } else {
        throw new Error("No courses found in database");
    }
  } catch (error) {
    console.warn("⚠️ Firebase fetch failed for CoursesPage, using fallback data:", error);
    // Fallback to static data if DB is empty or connection fails
    courses = [
        {
          id: "tcs-nqt",
          title: "TCS NQT Comprehensive Mastery",
          category: "MNC Special",
          duration: "40 Hours",
          students: "12k+",
          rating: "4.9",
          price: "Free",
          image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
        },
        {
          id: "algo-mastery",
          title: "Mastering Algorithmic Thinking",
          category: "Coding",
          duration: "25 Hours",
          students: "8k+",
          rating: "4.8",
          price: "Free",
          image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
        },
        {
          id: "infosys-power",
          title: "Infosys Power Programmer Prep",
          category: "Advanced",
          duration: "30 Hours",
          students: "5k+",
          rating: "4.7",
          price: "Free",
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
        }
      ];
  }

  return (
    <main className="pt-32 pb-24 bg-[#EAF6F4]/30 min-h-screen selection:bg-[#00B4A0]/20 selection:text-[#00B4A0]">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B4A0]/10 border border-[#00B4A0]/20 rounded-full text-[#00B4A0] text-[10px] font-black uppercase tracking-[0.2em]">
              <Star size={12} className="fill-current" /> Premium Learning Assets
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-[#1A1A2E] leading-tight tracking-tighter">
              Learning <span className="text-[#00B4A0] italic">Ecosystem</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg max-w-xl">
              From foundation to advanced MNC-specific training. Pick your path and start your journey today.
            </p>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-xl shadow-black/5 border border-gray-100">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-12 pr-6 py-3 bg-gray-50 rounded-xl focus:outline-none focus:bg-white border border-transparent focus:border-gray-200 transition-all text-sm font-bold"
              />
            </div>
            <Button className="bg-[#00B4A0] p-4 h-12 w-12 rounded-xl hover:bg-[#009e8c] transition-colors">
              <Filter size={20} className="text-white" />
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/50 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-[#00B4A0]/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 right-6">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border",
                    course.price === "Free" 
                      ? "bg-emerald-500/80 text-white border-emerald-400" 
                      : "bg-[#00B4A0]/80 text-white border-[#00B4A0]"
                  )}>
                    {course.price}
                  </span>
                </div>
              </div>
              
              <div className="p-10 space-y-6">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 text-[#00B4A0]">
                    <BookOpen size={14} /> {course.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {course.duration}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-[#1A1A2E] leading-snug group-hover:text-[#00B4A0] transition-colors">
                  {course.title}
                </h3>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-500">+{course.students} Students</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                    <Star size={14} className="fill-current" /> {course.rating}
                  </div>
                </div>

                <Link href={course.category === 'Coding' ? '/dashboard/programming' : `/dashboard/test/${course.id}/subtopics`} className="block pt-2">
                  <Button className="w-full h-14 bg-gray-50 hover:bg-[#00B4A0] text-[#1A1A2E] hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-none group/btn transition-all duration-300">
                    Initialize Setup <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination/Load More */}
        <div className="mt-20 flex justify-center">
          <Button size="lg" className="rounded-full px-12 h-16 bg-white text-[#1A1A2E] border-2 border-gray-100 hover:border-[#00B4A0] hover:text-[#00B4A0] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/5 active:scale-95">
            Load More Assets
          </Button>
        </div>
      </div>
    </main>
  );
}
