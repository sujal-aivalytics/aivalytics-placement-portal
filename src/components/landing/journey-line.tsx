"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

export function JourneyLine() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current.offsetHeight);
        }
    }, []);

    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Calculate the position of the "Head" based on scroll
    const headY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="absolute left-0 top-0 bottom-0 w-full overflow-hidden pointer-events-none z-0 hidden lg:block">
            {/* The Main Cable Line */}
            <div className="absolute left-8 lg:left-12 top-0 bottom-0 w-[4px]">
                {/* Dark Track */}
                <div className="absolute inset-0 bg-gray-800/20 rounded-full w-full h-full backdrop-blur-sm" />

                {/* Glowing Fill Line */}
                <motion.div
                    className="absolute top-0 w-full bg-gradient-to-b from-emerald-500 via-teal-400 to-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                    style={{ height: "100%", scaleY, transformOrigin: "top" }}
                />

                {/* The "Traveler" Head/Arrow */}
                <motion.div
                    className="absolute -left-[6px] w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-50 flex items-center justify-center ring-4 ring-emerald-500/30"
                    style={{ top: headY, translateY: "-50%" }}
                >
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                </motion.div>
            </div>

            {/* Decorative Knots/Waypoints */}
            <Knot yPos="12%" label="Start Here" />
            <Knot yPos="28%" label="How We Work" />
            <Knot yPos="52%" label="Why Us?" />
            <Knot yPos="75%" label="Mentors" />
            <Knot yPos="92%" label="Join Now" />
        </div>
    );
}

function Knot({ yPos, label }: { yPos: string; label: string }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["end end", "start center"]
    });

    const isActive = useTransform(scrollYProgress, (v) => v > 0.5);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.2, 1, 1]);

    return (
        <motion.div
            ref={ref}
            style={{ top: yPos }}
            className="absolute left-8 lg:left-12 -translate-x-1/2 flex items-center group pointer-events-auto"
        >
            {/* The Knot Visual */}
            <div className="relative">
                <motion.div
                    style={{ scale }}
                    className="w-10 h-10 rounded-full bg-[#0f172a] border-2 border-emerald-500/30 flex items-center justify-center shadow-lg group-hover:border-emerald-500 transition-colors z-20 relative"
                >
                    <ArrowDown className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                </motion.div>
                {/* Pulse Effect */}
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* The Unique "Note" Label */}
            <div className="ml-6 opacity-50 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden md:flex items-center">
                <div className="h-[2px] w-8 bg-gradient-to-r from-emerald-500/50 to-transparent mr-3" />
                <span className="text-emerald-400/80 font-mono text-xs uppercase tracking-[0.2em]">{label}</span>
            </div>
        </motion.div>
    );
}
