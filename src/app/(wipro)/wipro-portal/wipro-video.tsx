"use client";

import React, { useEffect, useRef } from 'react';

export function WiproVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <video
            ref={videoRef}
            src="https://www.wipro.com/content/dam/nexus/en/newsroom/events/2026/Videos/experience-wipro-intelligence-at-world-economic-forum-2026.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
        />
    );
}
