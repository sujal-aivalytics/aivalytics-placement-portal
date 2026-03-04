"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

interface ResumeThumbnailProps {
    children: ReactNode;
    onSelect?: () => void;
    showButton?: boolean;
}

/**
 * ResumeThumbnail - A responsive wrapper that shrinks A4 resume components
 * to fit perfectly inside any container while maintaining aspect ratio.
 */
export default function ResumeThumbnail({
    children,
    onSelect,
    showButton = false,
}: ResumeThumbnailProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.4);

    useEffect(() => {
        // A4 width in pixels at 96 DPI is approx 794px (210mm)
        const A4_WIDTH_PX = 794;

        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Calculate exact scale needed to fit the container
                const newScale = containerWidth / A4_WIDTH_PX;
                setScale(newScale);
            }
        };

        // Run initially and on resize
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full aspect-[210/297] relative overflow-hidden bg-slate-100 rounded-lg border border-slate-200"
        >
            {/* Scaled Resume Content */}
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: "794px", // Force A4 width
                    height: "1123px", // Force A4 height
                }}
                className="absolute top-0 left-0 pointer-events-none select-none"
            >
                <div className="shadow-sm bg-white">
                    {children}
                </div>
            </div>

            {/* Hover Overlay */}
            {showButton && (
                <div
                    onClick={onSelect}
                    className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group cursor-pointer"
                >
                    <button className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl">
                        Use Template
                    </button>
                </div>
            )}
        </div>
    );
}
