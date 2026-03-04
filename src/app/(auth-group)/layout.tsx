'use client';

import React from 'react';
import { CheckCircle2, Trophy, Clock, Code, Video } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const images = [
        "/images/image.png",
        "/images/image copy.png"
    ];
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full flex bg-gray-50/50">
            {/* Background Decor (Grid) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40"
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-[1200px] mx-auto min-h-screen flex items-center justify-center p-4 md:p-8">
                <div className="bg-white w-full rounded-[32px] shadow-2xl flex flex-col md:flex-row min-h-[700px] overflow-hidden">

                    {/* Left Panel (AiValytics Decorative) */}
                    <div className="w-full md:w-[45%] bg-primary relative p-12 flex flex-col justify-between overflow-hidden">
                        {/* Brand Logo Placeholder */}
                        <div className="relative z-20">
                            <div className="flex flex-col group">
                                <span className="font-black text-2xl text-white leading-none tracking-tighter">AiValytics</span>
                                <span className="text-[8px] font-bold text-white/60 uppercase tracking-[0.2em] mt-1">Online Education</span>
                            </div>
                        </div>

                        {/* Central Image & Floating Cards */}
                        <div className="absolute inset-0 flex items-center justify-center translate-y-12">
                            {/* Person Image (Slideshow) */}
                            <div className="relative w-full h-full mb-32 flex items-center justify-center z-10">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={images[currentImageIndex]}
                                        alt="Professional"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1.35 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="h-full w-full object-contain mix-blend-multiply drop-shadow-2xl opacity-90 absolute translate-y-8"
                                    />
                                </AnimatePresence>
                            </div>






                        </div>

                        {/* Bottom Card */}
                        <div className="relative z-20 bg-white/10 backdrop-blur-xl rounded-none border border-white/20 p-6 mx-auto w-full max-w-[320px] text-center mb-8">
                            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest text-xs">Join our community</h3>
                            <p className="text-sm text-white/80 font-medium italic">"Education is the movement from darkness to light."</p>
                        </div>
                    </div>

                    {/* Right Panel (Content) */}
                    <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white relative">
                        {/* Decorative connections */}
                        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
}
