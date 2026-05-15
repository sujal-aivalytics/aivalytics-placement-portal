'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Zap,
  MoreHorizontal,
  CheckCircle2,
  Search,
  Building2,
  Trophy,
  Target,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  LayoutDashboard,
  Clock3,
  Settings2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ----------------------------------------------------------------------------------
 *  TYPES
 * ---------------------------------------------------------------------------------- */
interface UserStats {
  testsTaken: number;
  avgScore: number;
  accuracy: number;
  strongestTopic: string;
}

interface RecentTest {
  id: string;
  name: string;
  score: number;
  percentage: number;
  date: string;
  status: 'Done' | 'In progress' | 'On hold';
}

/* ----------------------------------------------------------------------------------
 *  COMPONENT: UserDashboard
 * ---------------------------------------------------------------------------------- */
export default function UserDashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    name: "User",
    image: null as string | null,
    role: "student",
    accountType: "Regular"
  });

  // Sync profile name with session if it's currently "User"
  useEffect(() => {
    if (profile.name === "User" && session?.user?.name) {
      setProfile(prev => ({ ...prev, name: session.user.name || "" }));
    }
  }, [session, profile.name]);

  const [stats, setStats] = useState<UserStats>({
    testsTaken: 0,
    avgScore: 0,
    accuracy: 0,
    strongestTopic: "N/A",
  });

  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  // Visibility State
  const [visibleSections, setVisibleSections] = useState({
    stats: true,
    performance: true,
    activity: true,
    profile: true,
    upcoming: true
  });

  /* ----------------------------------------------------------------------------------
   *  DATA FETCHING
   * ---------------------------------------------------------------------------------- */
  const fetchData = useCallback(async () => {
    try {
      const profileRes = await fetch('/api/user/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile({
          name: profileData.name || session?.user?.name || "User",
          image: profileData.image || null,
          role: profileData.role || "student",
          accountType: profileData.accountType || "Regular"
        });
      }

      const resultsRes = await fetch('/api/results');
      const resultsData = await resultsRes.json();

      if (resultsData.results && resultsData.results.length > 0) {
        interface ApiResult {
          id: string;
          score: number;
          total: number;
          createdAt: string;
          test?: {
            title?: string;
            topic?: string;
            company?: string;
          };
        }
        const results = resultsData.results;

        // Stats Calculation
        const testsTaken = results.length;
        const totalPercentage = results.reduce((sum: number, r: ApiResult) => {
          const percentage = r.total > 0 ? (r.score / r.total) * 100 : 0;
          return sum + percentage;
        }, 0);
        const avgScore = testsTaken > 0 ? Math.round(totalPercentage / testsTaken) : 0;

        setStats({ testsTaken, avgScore, accuracy: avgScore, strongestTopic: "Logic" }); // Mock logic for topic

        // Recent Tests
        setRecentTests(results.slice(0, 5).map((r: ApiResult) => ({
          id: r.id,
          name: r.test?.title || 'Assessment',
          score: r.score,
          percentage: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
          date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          status: 'Done'
        })));

        // Chart Data
        setChartData(results.slice(0, 7).reverse().map((r: ApiResult, i: number) => ({
          name: `Test ${i + 1}`,
          score: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
        })));
      }
    } catch (error) {
      console.error('Failed load dashboard', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  /* ----------------------------------------------------------------------------------
   *  ANIMATIONS
   * ---------------------------------------------------------------------------------- */
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#f8fcfb] p-6 lg:p-10 font-sans text-slate-900 animate-in fade-in duration-1000">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-10"
      >

        {/* HEADER SECTION */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <Calendar className="w-4 h-4" />
              {currentDate}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 leading-none">
              Welcome back, <span className="text-primary italic">{profile.name.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-500 mt-4 max-w-2xl font-medium text-base leading-relaxed">
              Explore your analytical trajectory and continue your transformation through our advanced assessment suite.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-5 rounded-none border border-gray-200 bg-white hover:bg-slate-50 hover:border-primary/30 text-gray-600 hover:text-primary text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Interface
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-none border-gray-100 shadow-2xl" align="end">
                <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] py-4">Dashboard Modules</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={visibleSections.stats}
                  onCheckedChange={(checked) => setVisibleSections(prev => ({ ...prev, stats: checked }))}
                  onSelect={(e) => e.preventDefault()}
                  className="font-bold text-[11px] py-3"
                >
                  Statistics
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleSections.performance}
                  onCheckedChange={(checked) => setVisibleSections(prev => ({ ...prev, performance: checked }))}
                  onSelect={(e) => e.preventDefault()}
                  className="font-bold text-[11px] py-3"
                >
                  Growth Chart
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleSections.activity}
                  onCheckedChange={(checked) => setVisibleSections(prev => ({ ...prev, activity: checked }))}
                  onSelect={(e) => e.preventDefault()}
                  className="font-bold text-[11px] py-3"
                >
                  Recent Audits
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleSections.profile}
                  onCheckedChange={(checked) => setVisibleSections(prev => ({ ...prev, profile: checked }))}
                  onSelect={(e) => e.preventDefault()}
                  className="font-bold text-[11px] py-3"
                >
                  Identity Card
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/dashboard/topics" className="flex-1 md:flex-none">
              <Button className="w-full h-11 px-6 rounded-none bg-gray-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                New Assessment
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* STATS OVERVIEW CARDS */}
        {visibleSections.stats && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatCard
              icon={<Target className="w-6 h-6" />}
              label="Assessed Modules"
              value={stats.testsTaken}
              trend="+12%"
              color="primary"
            />
            <StatCard
              icon={<Trophy className="w-6 h-6" />}
              label="Average Precision"
              value={`${stats.avgScore}%`}
              trend="Top 15%"
              color="primary"
            />
            <StatCard
              icon={<BrainCircuit className="w-6 h-6" />}
              label="Dominant Skill"
              value={stats.strongestTopic || "Logic"}
              trend="92%"
              color="primary"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              label="Engagement Time"
              value="12h 4m"
              trend="+2.5h"
              color="primary"
            />
          </motion.div>
        )}

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT COLUMN (Chart & Activity) */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-8">

            {/* Performance Chart */}
            {visibleSections.performance && (
              <div className="bg-white rounded-none p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-between items-center mb-10 relative z-10">
                  <div>
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-2">Longitudinal Analysis</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Growth Trajectory</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-primary hover:bg-primary/5">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>

                <div className="h-[350px] w-full relative z-10" style={{ minHeight: '350px', minWidth: '100px' }}>
                  {chartData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.length ? chartData : [{ name: 'T1', score: 0 }]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1eb2a6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#1eb2a6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '0', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '16px', backgroundColor: '#111827', color: '#fff' }}
                          itemStyle={{ color: '#1eb2a6', fontWeight: 'bold' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#1eb2a6"
                          strokeWidth={5}
                          fillOpacity={1}
                          fill="url(#colorScore)"
                          activeDot={{ r: 10, strokeWidth: 0, fill: '#1eb2a6' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity List */}
            {visibleSections.activity && (
              <div className="bg-white rounded-none p-8 border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-2">Audit Logs</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Recent Assessment Records</h3>
                  </div>
                  <Link href="/dashboard/results" className="text-[10px] font-black text-primary hover:opacity-70 uppercase tracking-[0.2em] border-b-2 border-primary/20 pb-1 transition-all">View Full Registry</Link>
                </div>

                <div className="space-y-3">
                  {recentTests.length > 0 ? (
                    recentTests.map((test, i) => (
                      <div key={i} className="group flex items-center justify-between p-6 rounded-none border border-transparent hover:border-gray-100 hover:bg-slate-50 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-none flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-white shadow-sm ${test.score >= 80 ? 'bg-primary/5 text-primary' : 'bg-gray-50 text-gray-300'}`}>
                            {test.score >= 80 ? <Trophy className="w-7 h-7" /> : <BrainCircuit className="w-7 h-7" />}
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900 text-lg group-hover:text-primary transition-colors tracking-tight">{test.name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">{test.date} &bull; COMPLETED</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-gray-900 tracking-tighter">{test.score}%</div>
                          {test.score >= 70 ? (
                            <span className="text-[8px] font-black text-primary bg-primary/10 px-3 py-1 rounded-none uppercase tracking-widest mt-2 inline-block border border-primary/10">Distinction</span>
                          ) : (
                            <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-none uppercase tracking-widest mt-2 inline-block border border-amber-100">Proficiency</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-24 bg-gray-50/50 rounded-none border border-dashed border-gray-100">
                      <p className="text-gray-300 font-black uppercase tracking-[0.2em] text-sm">No activity records identified.</p>
                      <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2">Initialize your first assessment to generate audit logs.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </motion.div>

          {/* RIGHT COLUMN (Profile & Upcoming) */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">

            {/* Identity Card */}
            {visibleSections.profile && (
              <div className="bg-white rounded-none p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="absolute top-0 w-full h-48 bg-gradient-to-b from-primary/5 to-transparent"></div>
                <div className="relative z-10 w-full">
                  <div className="relative inline-block mb-8">
                    <Avatar className="w-32 h-32 rounded-none border-8 border-white shadow-xl transition-transform duration-500 group-hover:scale-105">
                      <AvatarImage src={profile.image || undefined} />
                      <AvatarFallback className="bg-primary text-white text-4xl font-black">{profile.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary border-4 border-white rounded-none shadow-lg"></div>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{profile.name}</h2>
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-3 italic">{profile.role === 'student' ? 'Institutional Member' : 'Faculty curator'}</p>

                  <div className="mt-8 space-y-3 w-full">
                    <div className="bg-[#f0f9f8] p-4 rounded-none border border-primary/5 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Global Rank</div>
                      <div className="text-xl font-black text-gray-900">#42</div>
                    </div>
                    <div className="bg-[#f0f9f8] p-5 rounded-none border border-primary/5 flex items-center justify-between">
                      <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Membership</div>
                      <div className="text-xl font-black text-primary">{profile.accountType}</div>
                    </div>
                  </div>

                  <Link href="/dashboard/profile" className="w-full mt-8 block">
                    <Button className="w-full rounded-none bg-gray-900 text-white hover:bg-black h-11 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                      Identity Dossier
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Announcement Card */}
            {visibleSections.upcoming && (
              <div className="bg-gray-900 rounded-none p-8 text-white relative overflow-hidden group shadow-xl transition-all duration-500 hover:shadow-primary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-white/5 backdrop-blur-xl p-4 rounded-none border border-white/10 shadow-inner">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <Badge className="bg-primary text-white border-0 font-black uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-none">Event</Badge>
                  </div>

                  <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-2">Upcoming assessment</p>
                  <h3 className="text-3xl font-black leading-none mb-3 tracking-tighter">Google SDE <br /><span className="text-primary italic">Hackathon</span></h3>
                  <div className="flex items-center gap-2 text-white/50 mb-8 font-black uppercase tracking-widest text-[10px]">
                    <Clock3 className="w-4 h-4 text-primary/40" />
                    Aug 15  &bull;  14:00 GMT
                  </div>

                  <Button className="w-full bg-white text-gray-900 hover:bg-primary hover:text-white h-11 rounded-none text-[11px] font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                    Register Now
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-primary/5 rounded-none p-8 border border-primary/20 border-dashed">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">Support & Feedback</p>
              <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest">Encountering anomalies? Contact the administration department.</p>
              <Button variant="link" className="text-primary p-0 h-auto mt-3 font-black text-[10px] uppercase tracking-widest hover:opacity-70">Reach Support &rarr;</Button>
            </div>

          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: any) {
  return (
    <div className="bg-white p-8 rounded-none border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group aivalytics-card overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`p-4 rounded-none transition-all duration-500 group-hover:bg-primary group-hover:text-white shadow-sm bg-primary/10 text-primary`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-2 text-[10px] font-black text-primary bg-[#f0f9f8] px-3 py-1.5 rounded-none uppercase tracking-widest border border-primary/10">
            <TrendingUp className="w-3.5 h-3.5" />
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">{label}</p>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
      </div>
    </div>
  );
}
