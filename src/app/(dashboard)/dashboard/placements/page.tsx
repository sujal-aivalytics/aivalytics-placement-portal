'use client';

import { ApplicationsTable } from "@/components/placements/applications-table";
import { PlacementFilters } from "@/components/placements/placement-filters";
import { LayoutDashboard, Briefcase, TrendingUp, Clock, Award, Building2, ChevronRight } from "lucide-react";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: string;
  company: string;
  status: string;
  currentStage: string | null;
  finalTrack: string | null;
  finalDecision: string | null;
  createdAt: string;
}

export default function PlacementsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await fetch("/api/placements/my-applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header Section - Professional & Minimal */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Placements</h1>
              <p className="text-lg text-gray-600 mt-2">Track your applications and manage your placement journey</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Placement Drive 2025–2026 • Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Placements</span>
        </nav>
      </div>

      {/* Main Content */}
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[1600px] mx-auto px-6 py-8"
      >
        {/* Main Area - Full Width */}
        <motion.div variants={item} className="space-y-8">
          {/* Filters Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <PlacementFilters />
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Your Applications</CardTitle>
                  <CardDescription>Real-time progress across all active drives</CardDescription>
                </div>
                <Badge variant="outline">{applications.length} Applications</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ApplicationsTable />
            </CardContent>
          </Card>
        </motion.div>


      </motion.main>
    </div>
  );
}
