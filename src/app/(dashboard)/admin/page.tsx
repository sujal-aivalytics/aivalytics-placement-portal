import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { PerformanceChart } from "@/components/admin/performance-chart";
import { RecentStudentsTable } from "@/components/admin/recent-students-table";
import { getDashboardStats } from "@/lib/admin-stats";
import { Calendar } from "@/components/ui/calendar";
import { Bell, Search, Settings, Activity, UserPlus, FileText, BookOpen, Upload, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const data = await getDashboardStats();

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
        <div>
          <p className="text-ui-sm text-primary font-semibold uppercase tracking-wider mb-2">Management Center</p>
          <h1 className="text-h1 text-gray-900 tracking-tight leading-none">
            Welcome back, <span className="text-primary italic">{session?.user?.name?.split(' ')[0] || "Admin"}</span>
          </h1>
          <p className="text-body text-gray-500 mt-3">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 bg-white p-2 pl-4 rounded-none border border-gray-100 shadow-sm">
            <Search className="w-5 h-5 text-gray-300" />
            <input type="text" placeholder="Global Search..." className="bg-transparent border-none outline-none text-ui-sm w-48 placeholder:text-gray-300 uppercase tracking-wide" />
          </div>
          <button className="relative p-4 bg-white rounded-none border border-gray-100 shadow-md text-gray-400 hover:text-primary hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-500" />
            <Bell className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          </button>
          <div className="flex items-center gap-4 bg-white p-2 pl-5 pr-2 rounded-none border border-gray-100 shadow-md">
            <div className="text-right hidden sm:block">
              <p className="text-ui-sm font-semibold text-gray-900 leading-none uppercase tracking-wide">{session?.user?.name}</p>
              <p className="text-caption text-primary font-medium leading-none mt-1 uppercase tracking-wide">Administrator</p>
            </div>
            <Avatar className="w-12 h-12 rounded-none border-2 border-primary/10">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-primary text-white font-black">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div>
        <div className="flex items-center gap-3 mb-8">
           <div className="h-8 w-2 bg-primary rounded-full" />
           <h2 className="text-h4 text-gray-900 tracking-tight uppercase font-semibold">System Overview</h2>
        </div>
        <DashboardStats stats={data} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="h-8 w-2 bg-primary rounded-full" />
               <h2 className="text-h4 text-gray-900 tracking-tight uppercase font-semibold">Administrative Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/admin/tests" className="group">
                <div className="bg-white rounded-none p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="p-5 rounded-none bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-200 group-hover:text-primary transition-all group-hover:translate-x-2" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="card-title text-gray-900 mb-3 group-hover:text-primary transition-colors">Curriculum</h3>
                    <p className="text-caption text-gray-400 uppercase tracking-wide">Manage academic subtopics and learning modules</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/subtopics" className="group">
                <div className="bg-white rounded-none p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="p-5 rounded-none bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      <Upload className="w-8 h-8" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-200 group-hover:text-primary transition-all group-hover:translate-x-2" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="card-title text-gray-900 mb-3 group-hover:text-primary transition-colors">Resource Bank</h3>
                    <p className="text-caption text-gray-400 uppercase tracking-wide">Import assessments and question banks in bulk</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-none p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                 <div className="h-6 w-1.5 bg-primary rounded-full" />
                 <h3 className="text-ui font-semibold text-gray-900 uppercase tracking-wide">Activity Stream</h3>
              </div>
              <span className="text-caption font-semibold text-primary cursor-pointer hover:opacity-70 uppercase tracking-wide border-b-2 border-primary/20 pb-0.5">Audit Log</span>
            </div>
            <div className="space-y-6">
              {/* @ts-ignore */}
              {data.recentActivities?.length > 0 ? (
                // @ts-ignore
                data.recentActivities.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-none hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                    <div className={`w-14 h-14 rounded-none flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-inner ${item.type === 'user_signup' ? 'bg-primary/10 text-primary' :
                        item.type === 'system' ? 'bg-amber-100 text-amber-600' :
                          'bg-primary/20 text-primary'
                      }`}>
                      {item.type === 'user_signup' ? <UserPlus className="w-7 h-7" /> :
                        item.type === 'system' ? <Settings className="w-7 h-7" /> :
                          <Activity className="w-7 h-7" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="card-title text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-caption text-gray-400 font-medium uppercase tracking-wide mt-1 truncate">{item.description}</p>
                    </div>
                    <div className="text-caption text-primary font-semibold whitespace-nowrap bg-primary/5 px-4 py-2 rounded-full uppercase tracking-wide shadow-sm">
                      {item.time}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-300 text-ui font-semibold uppercase tracking-wide py-10 opacity-50">Steady state - No recent activity</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Chart & Calendar */}
        <div className="space-y-10">
          {/* Calendar */}
          <div className="bg-white rounded-none p-10 border border-gray-100 shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <div className="flex items-center gap-3 mb-8">
               <div className="h-6 w-1.5 bg-primary rounded-full" />
               <h3 className="text-ui font-semibold text-gray-900 uppercase tracking-wide">Schedule</h3>
            </div>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-none border-0 font-sans"
              />
            </div>
          </div>

          {/* Weekly Timetable */}
          <div className="bg-white rounded-none p-10 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="h-6 w-1.5 bg-primary rounded-full" />
                 <h3 className="text-ui font-semibold text-gray-900 uppercase tracking-wide">Assignments</h3>
              </div>
              <span className="text-caption font-semibold text-primary cursor-pointer hover:opacity-70 uppercase tracking-wide">Full List</span>
            </div>
            <div className="space-y-4">
              {[
                { time: "10:00", title: "Assessment Review", sub: "Global Cohort 3A" },
                { time: "11:30", title: "Integrity Check", sub: "Automated Protocol" },
                { time: "15:30", title: "Corporate Drive", sub: "Fortune 500 Entry" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 rounded-none bg-[#f0f9f8] hover:bg-white hover:shadow-xl hover:scale-105 border border-primary/5 transition-all duration-300 group">
                  <div className="text-caption font-semibold text-primary bg-white px-3 py-2 rounded-none shadow-sm group-hover:shadow-inner group-hover:bg-primary group-hover:text-white transition-all">{item.time}</div>
                  <div>
                    <h4 className="text-ui font-semibold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-caption text-gray-400 font-medium uppercase tracking-wide mt-1 italic">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Tables */}
      <div>
        <div className="flex items-center gap-3 mb-8">
           <div className="h-8 w-2 bg-primary rounded-full" />
           <h2 className="text-h4 text-gray-900 tracking-tight uppercase font-semibold">Cohort Performance</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <RecentStudentsTable students={data.recentApplications} />
          </div>
          <div className="bg-white rounded-none p-10 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
             <div className="flex items-center gap-3 mb-10 w-full text-left">
                 <div className="h-6 w-1.5 bg-primary rounded-full" />
                 <h3 className="text-ui font-semibold text-gray-900 uppercase tracking-wide">Distribution</h3>
              </div>
             <PerformanceChart data={data.statusDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}
