'use client';

import { motion } from 'framer-motion';
import { ScrollAnimation } from './scroll-animation';
import Image from 'next/image';

const LifeAtAiValytics = () => {
    return (
        <section className="py-24 bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 mb-16">
                <ScrollAnimation className="text-center max-w-2xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs tracking-widest uppercase">
                        🚀 Join the Revolution
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                        Life at <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Aivalytics</span>
                    </h2>
                    <p className="text-lg text-gray-400 font-medium">
                        More than just a platform. We are a community of dreamers, achievers, and future leaders.
                    </p>
                </ScrollAnimation>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-auto md:h-[800px]">
                {/* The Office - Top Left */}
                <ScrollAnimation className="md:col-span-1 md:row-span-1">
                    <div className="relative group overflow-hidden rounded-[2.5rem] h-[300px] md:h-full shadow-2xl border-4 border-gray-800">
                        <Image
                            src="/images/life_office.png"
                            alt="The Office"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">The Office</h3>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Team - Top Mid-Left */}
                <ScrollAnimation delay={0.1} className="md:col-span-1 md:row-span-1">
                    <div className="relative group overflow-hidden rounded-[2.5rem] h-[300px] md:h-full shadow-2xl border-4 border-gray-800">
                        <Image
                            src="/images/life_team.png"
                            alt="Team"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Team</h3>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Innovation Lab - Top Mid-Right */}
                <ScrollAnimation delay={0.2} className="md:col-span-1 md:row-span-1">
                    <div className="relative group overflow-hidden rounded-[2.5rem] h-[300px] md:h-full shadow-2xl border-4 border-gray-800">
                        <Image
                            src="/images/students_seminar.png"
                            alt="Innovation Lab"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Innovation Lab</h3>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* & The Work - Tall Full Right Span */}
                <ScrollAnimation delay={0.3} className="md:col-span-1 md:row-span-2">
                    <div className="relative group overflow-hidden rounded-[2.5rem] h-[400px] md:h-full shadow-2xl border-4 border-gray-800">
                        <Image
                            src="/images/students_collaborating.png"
                            alt="& The Work"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">& The Work</h3>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* The View - Bottom Left */}
                <ScrollAnimation delay={0.4} className="md:col-span-1 md:row-span-1">
                    <div className="relative group overflow-hidden rounded-[2.5rem] h-[300px] md:h-full shadow-2xl border-4 border-gray-800">
                        <Image
                            src="/images/life_view.png"
                            alt="The View"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">The View</h3>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Forbes 30 under 30 - Bottom Mid Wide Span */}
                <ScrollAnimation delay={0.5} className="md:col-span-2 md:row-span-1">
                    <div className="relative group overflow-hidden rounded-[2.5rem] h-[300px] md:h-full shadow-2xl border-4 border-gray-800">
                        <Image
                            src="/images/life_founders.png"
                            alt="Forbes 30 under 30"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Forbes <br /> 30 under 30
                            </h3>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section >
    );
};

export default LifeAtAiValytics;
