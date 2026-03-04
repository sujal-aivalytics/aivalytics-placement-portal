"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/loader";

export function SiteLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading time or resource loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds loader

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
                >
                    <div className="flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Spinner size={40} className="text-primary" />
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                                animate={{ rotate: 180 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-black tracking-tighter text-foreground"
                        >
                            AiValytics
                        </motion.h1>

                        <motion.div
                            className="h-1 w-32 bg-muted overflow-hidden rounded-full mt-2"
                        >
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
