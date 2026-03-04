"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, Video, VideoOff, MoreVertical, ShieldCheck, Wifi } from "lucide-react";
import Link from 'next/link';

export default function VirtualLobbyPage() {
    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-8 items-center justify-center p-4">

            {/* Main Video Preview */}
            <div className="flex-1 w-full max-w-4xl aspect-video bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden relative group border-4 border-white/20">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="text-center space-y-4">
                        <Avatar className="w-32 h-32 mx-auto border-4 border-purple-500/30">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-white text-sm font-medium">Camera Active</span>
                        </div>
                    </div>
                </div>

                {/* Controls Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 flex items-center justify-center gap-6 bg-gradient-to-t from-black/80 to-transparent opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur border-0">
                        <Mic className="w-6 h-6" />
                    </Button>
                    <Button variant="destructive" size="icon" className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20">
                        <VideoOff className="w-6 h-6" />
                    </Button>
                    <Link href="/wipro-portal/result">
                        <Button className="h-14 px-8 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold border-0 shadow-lg shadow-green-500/20">
                            Join Interview
                        </Button>
                    </Link>
                </div>

                <div className="absolute top-6 right-6 flex gap-3">
                    <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 text-white/80 text-xs font-medium border border-white/10">
                        <Wifi className="w-3.5 h-3.5" /> Excellent Connection
                    </div>
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="w-full md:w-80 space-y-6">
                <Card className="border-0 shadow-xl shadow-purple-900/5 rounded-3xl overflow-hidden">
                    <div className="h-24 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                    </div>
                    <CardContent className="pt-0 -mt-10 px-6 pb-6 relative text-center">
                        <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
                            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">HR</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Ms. Sarah Jenkins</h3>
                        <p className="text-sm text-slate-500">Talent Acquisition Lead</p>

                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Status</span>
                                <span className="text-green-600 font-semibold">Online</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Queue Position</span>
                                <span className="text-slate-900 font-bold">Next in line</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        End-to-end Encrypted Session
                    </p>
                </div>
            </div>

        </div>
    );
}
