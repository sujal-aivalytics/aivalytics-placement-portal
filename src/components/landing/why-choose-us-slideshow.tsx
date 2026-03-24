"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const slides = [
    {
        src: "/jira/WEBP/collaborate-share-key-resources.webp",
        title: "Collaborative Learning",
        subtitle: "Work together with peers to solve complex problems and grow collectively."
    },
    {
        src: "/jira/WEBP/collaborate-automate-workflows.webp",
        title: "Interactive Sessions",
        subtitle: "Engage in real-time discussions with industry experts and mentors."
    },
    {
        src: "/jira/WEBP/jswf-collaborate-streamline-requests-2.webp",
        title: "Expert Seminars",
        subtitle: "Attend high-impact seminars that bridge the gap between AiValytics and industry."
    }
];

export function WhyChooseUsSlideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-[600px] h-[500px] lg:h-[400px] rounded-[3rem] overflow-hidden shadow-2xl bg-black group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={slides[currentIndex].src}
                        alt={slides[currentIndex].title}
                        className="w-full h-full object-cover"
                    />

                    {/* Black Overlay (Drop) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                </motion.div>
            </AnimatePresence>

            {/* Bottom Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-16 z-20">
                <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="max-w-xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-gray-200 overflow-hidden shadow-lg"
                                >
                                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="font-bold text-white text-lg drop-shadow-md">+10k Students</p>
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 drop-shadow-xl">
                        {slides[currentIndex].title}
                    </h3>
                    <p className="text-xl text-gray-200 font-medium leading-relaxed drop-shadow-lg">
                        {slides[currentIndex].subtitle}
                    </p>
                </motion.div>

                {/* Progress Indicators */}
                <div className="flex gap-3 mt-10">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-12 bg-emerald-500" : "w-6 bg-white/30"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
