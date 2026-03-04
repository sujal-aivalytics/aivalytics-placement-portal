'use client';

import { Briefcase, GraduationCap, Award, Users } from "lucide-react";
import { motion } from 'framer-motion';
import { ScrollAnimation } from './scroll-animation';
import Image from 'next/image';

const mentors = [
    {
        name: 'Shourya Kaushik',
        image: '/images/mentor_shourya.png',
        companies: ['/images/logos/cred.svg', '/images/logos/kpmg.svg'],
    },
    {
        name: 'Siddhant Soni',
        image: '/images/mentor_siddhant.png',
        companies: ['/images/logos/flipkart.svg', '/images/logos/rippling.svg'],
    },
    {
        name: 'Siddhart',
        image: '/images/mentor_siddhart.png',
        companies: ['/images/logos/deloitte.svg'],
    },
    {
        name: 'Rohit Sharma',
        image: '/images/mentor_rohit.png',
        companies: ['/images/logos/paytm.svg', '/images/logos/angelone.svg'],
    },
    {
        name: 'Atulya Kaushik',
        image: '/images/mentor_atulya.png',
        companies: ['/images/logos/google.svg', '/images/logos/instamojo.svg'],
    },
];

const MentorsSection = () => {
    // Quadruple mentors to ensure smooth infinite loop coverage
    const duplicatedMentors = [...mentors, ...mentors, ...mentors, ...mentors];

    return (
        <section className="py-24 bg-[#0a0a0a] mb-20 text-white overflow-hidden relative">
            <div className="container mx-auto px-4 mb-16 relative z-10">
                <div className="flex items-end justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs tracking-widest uppercase mb-6">
                            <Users className="w-4 h-4" />
                            World-Class Mentors
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                            Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Industry's Best</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-medium">
                            Get guided by experts who have cracked the toughest interviews at top tech giants.
                        </p>
                    </div>
                </div>
            </div>

            {/* Infinite Scroll Container */}
            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks for ultra-premium look */}
                <div className="absolute left-0 top-0 bottom-0 w-32 md:w-80 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 md:w-80 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-20 pointer-events-none" />

                <ScrollAnimation delay={0.2}>
                    <motion.div
                        className="flex gap-16 w-fit px-4"
                        animate={{
                            x: [0, -280 * mentors.length - (64 * mentors.length)]
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 35,
                                ease: "linear",
                            },
                        }}
                    >
                        {duplicatedMentors.map((mentor, idx) => (
                            <div key={`${mentor.name}-${idx}`} className="flex flex-col items-center shrink-0 w-[280px] group cursor-pointer">
                                <ScrollAnimation key={idx} delay={idx * 0.1} className="flex flex-col items-center">
                                    {/* Circular Avatar Container */}
                                    <div className="relative mb-6">
                                        {/* Rotating Border Glow */}
                                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow" />

                                        {/* Image Container */}
                                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-[4px] border-[#0a0a0a] bg-[#0a0a0a] z-10 group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={mentor.image}
                                                alt={mentor.name}
                                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-2xl font-bold text-white mb-3 text-center group-hover:text-emerald-400 transition-colors">
                                        {mentor.name}
                                    </h3>

                                    {/* Pill Badge */}
                                    <div className="px-5 py-2 rounded-xl bg-[#1a1a1a] border border-gray-800 group-hover:border-emerald-500/30 transition-colors">
                                        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase group-hover:text-emerald-400 transition-colors">
                                            {mentor.name.split(' ')[0]} @ TOP TECH
                                        </span>
                                    </div>
                                </ScrollAnimation>
                            </div>
                        ))}
                    </motion.div>
                </ScrollAnimation>
            </div>
        </section>
    );
};

export default MentorsSection;
