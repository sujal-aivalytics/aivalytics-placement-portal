"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="mb-16 mt-18 container mx-auto px-4 md:px-0">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-900 shadow-2xl shadow-emerald-500/30 group"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

                    {/* Floating Blobs */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl mix-blend-screen"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], rotate: [0, -45, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl mix-blend-screen"
                    />

                    {/* Animated Grid/Particles */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-12 md:p-20 gap-12">

                    {/* Left Content */}
                    <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm text-emerald-50 font-medium text-sm"
                        >
                            <span>Join Top 1% of Students</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
                        >
                            Start Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 to-teal-100 drop-shadow-sm">
                                Success Story
                            </span> Today
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-emerald-100 text-lg md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed"
                        >
                            Join thousands of students who have cracked their dream companies with Aivalytics. Your offer letter is waiting.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
                        >
                            <Link href="/signup">
                                <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-8 h-14 rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.6)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.8)] transition-all duration-300 text-lg group">
                                    Get Started Now
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <p className="text-emerald-200/80 text-sm font-medium">No credit card required</p>
                        </motion.div>
                    </div>

                    {/* Right Image */}
                    <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                            className="relative z-10"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-emerald-400/30 blur-[80px] rounded-full -z-10 animate-pulse"></div>

                            {/* Floating Animation */}
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/images/image copy.png"
                                    alt="Student Success"
                                    className="relative h-[450px] md:h-[550px] w-auto object-contain drop-shadow-2xl"
                                />
                            </motion.div>

                            {/* Floating Badges */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute top-10 -right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-bounce delay-700 duration-[3000ms]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl">💼</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Offer Received</p>
                                        <p className="text-sm font-bold text-gray-900">₹45 LPA Package</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
