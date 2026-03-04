"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6", className)}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {title}
                </h1>
                {description && (
                    <p className="text-muted-foreground mt-1 text-lg">
                        {description}
                    </p>
                )}
            </motion.div>
            {children && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {children}
                </motion.div>
            )}
        </div>
    );
}
