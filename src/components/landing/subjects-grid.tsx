'use client';

import { motion } from 'framer-motion';
import { ScrollAnimation } from './scroll-animation';
import { Code, Binary, Cpu, Database, Globe, Layers, Terminal, Braces, BookOpen } from 'lucide-react';

const subjects = [
    { name: 'Top 100 Codes', icon: Code },
    { name: 'Top 500 Codes', icon: Binary },
    { name: 'Learn C', icon: Terminal },
    { name: 'Learn C++', icon: Braces },
    { name: 'Learn DSA', icon: Layers },
    { name: 'Competitive Coding', icon: Cpu },
    { name: 'Learn OS', icon: Globe },
    { name: 'Learn DBMS', icon: Database },
];

const SubjectsGrid = () => {
    return (
        <section className="py-12 lg:py-16 relative z-10">
            <div className="container mx-auto px-4">
                <ScrollAnimation className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs tracking-widest uppercase">
                        <BookOpen className="w-4 h-4" />
                        Comprehensive Curriculum
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                        Programming/CS <span className="text-emerald-500">Subject</span>
                    </h2>
                    <p className="text-lg text-gray-300 font-medium">
                        Competitive Coding, Basic / Advanced Coding, Top Codes, of Languages like - C/C++/Java or CS Subjects Like OS, DBMS etc
                    </p>
                </ScrollAnimation>
            </div>
            <div className="flex flex-col items-center">
                {/* Grid */}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {subjects.map((subject, idx) => (
                        <ScrollAnimation key={subject.name} delay={idx * 0.05} className="group relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-full bg-[#0f172a]/80 backdrop-blur-md border border-gray-800 p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300 hover:border-emerald-500/50 flex flex-col items-center text-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30`}>
                                    <subject.icon />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition-colors">{subject.name}</h3>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        
        </section>
      
    );
};

export default SubjectsGrid;
