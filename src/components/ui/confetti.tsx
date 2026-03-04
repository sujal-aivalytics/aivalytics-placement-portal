"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function Confetti({ width, height }: { width: number, height: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pieces, setPieces] = useState<any[]>([]);

    useEffect(() => {
        const colors = ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'];
        const newPieces = Array.from({ length: 150 }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height - height,
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: Math.random() * 4 + 1,
            speed: Math.random() * 3 + 1,
            angle: Math.random() * 2 * Math.PI,
            spin: Math.random() * 0.2 - 0.1
        }));
        setPieces(newPieces);
    }, [width, height]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const update = () => {
            ctx.clearRect(0, 0, width, height);

            pieces.forEach((p) => {
                p.y += p.speed;
                p.angle += p.spin;
                p.x += Math.sin(p.angle) * 1;

                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            animationId = requestAnimationFrame(update);
        };

        update();

        return () => cancelAnimationFrame(animationId);
    }, [pieces, width, height]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="fixed inset-0 pointer-events-none z-50"
        />
    );
}
