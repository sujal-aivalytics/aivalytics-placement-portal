"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextRotatorProps {
    texts: string[];
    className?: string;
}

export function TextRotator({ texts, className }: TextRotatorProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [texts.length]);

    // Calculate the longest text for width preservation
    const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b), "");

    return (
        <div className={`inline-flex relative overflow-hidden h-[1.1em] w-fit align-top ${className}`}>
            {/* Invisible spacer to set width/height based on longest text */}
            <span className="opacity-0 invisible">{longestText}</span>

            <AnimatePresence mode="popLayout">
                <motion.span
                    key={index}
                    initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
                    transition={{
                        y: { type: "spring", stiffness: 50, damping: 15 }, // Softer spring for floaty effect
                        opacity: { duration: 0.4 },
                        filter: { duration: 0.3 }
                    }}
                    className="absolute left-0 top-0 whitespace-nowrap"
                >
                    {texts[index]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
