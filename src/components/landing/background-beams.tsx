"use client";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundBeams = () => {
    return (
        <div className="absolute inset-0 z-0 h-full w-full bg-[#020617] overflow-hidden pointer-events-none">
            {/* Deep Space Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-blob" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-blob animation-delay-2000" />
            <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] animate-blob animation-delay-4000" />

            {/* Moving Grid */}
            <div
                className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"
                style={{
                    backgroundSize: "50px 50px",
                    maskImage: "linear-gradient(to bottom, transparent, black, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, black, transparent)"
                }}
            />

            {/* Shooting Stars / Particles */}
            <ParticleStream />
        </div>
    );
};

const ParticleStream = () => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Generate random particles
    const particles = Array.from({ length: 20 });

    return (
        <div className="absolute inset-0 overflow-hidden">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full"
                    initial={{
                        x: Math.random() * 100 + "%", // Random horizontal start
                        y: -20, // Start above screen
                        opacity: Math.random(),
                    }}
                    animate={{
                        y: ["0vh", "100vh"],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10, // Slow float 10-20s
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 10,
                    }}
                />
            ))}
        </div>
    )
}
