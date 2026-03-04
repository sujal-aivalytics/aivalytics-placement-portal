"use client";

import { motion } from "framer-motion";

interface ScrollAnimationProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    [key: string]: any;
}

export function ScrollAnimation({ children, className, delay = 0, ...props }: ScrollAnimationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
