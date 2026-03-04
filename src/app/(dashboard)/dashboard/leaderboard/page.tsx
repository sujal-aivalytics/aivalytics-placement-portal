"use client";

import React from 'react';
import Leaderboard from '@/components/leaderboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Global Leaderboard</h1>
                <p className="text-gray-500">See where you stand among all students.</p>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Compete & Win</h3>
                        <p className="text-sm text-gray-600">Top performers get exclusive access to premium placement drives.</p>
                    </div>
                </div>

                <Leaderboard limit={50} />
            </div>
        </div>
    );
}
