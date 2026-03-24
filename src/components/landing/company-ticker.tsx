"use client";

import { motion } from "framer-motion";

const companies = [
    { name: "TCS", logo: "/logos/tcs-1696999494.jpg" },
    { name: "Infosys", logo: "/logos/info.png" },
    { name: "Wipro", logo: "/logos/Wipro_Secondary-Logo_Color_RGB.png" },
    { name: "Accenture", logo: "/logos/acc.png" },
    { name: "Cognizant", logo: "/logos/cog.png" },
    { name: "IBM", logo: "/logos/IBM.png" },
];

export const CompanyTicker = () => {
    // Duplicate list for seamless loop
    const duplicatedCompanies = [...companies, ...companies, ...companies, ...companies];

    return (
        <div className="w-full overflow-hidden py-12 border-y border-gray-100 bg-white relative z-10">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm mb-8 font-black text-gray-400 tracking-[0.2em] uppercase">
                    Top Companies Hiring Preparation
                </p>
            </div>

            <div className="relative flex">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex items-center gap-12 md:gap-20 px-4"
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedCompanies.map((company, index) => (
                        <div
                            key={`${company.name}-${index}`}
                            className="relative w-32 h-16 md:w-40 md:h-20 shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110 cursor-pointer"
                        >
                            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center p-4 shadow-sm">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
