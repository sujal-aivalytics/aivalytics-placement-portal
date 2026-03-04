
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export function ProUpgradeCard() {
    return (
        <div className="relative overflow-hidden rounded-[24px] p-6 border border-white/20 shadow-xl group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 opacity-90 transition-opacity group-hover:opacity-100" />

            {/* Texture/Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            <div className="relative z-10 text-white flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-inner">
                    <Crown className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                </div>

                <h3 className="font-bold text-xl mb-2 tracking-tight">Upgrade to Pro</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed opacity-90">
                    Unlock advanced analytics, unlimited job postings, and AI-powered candidate recommendations.
                </p>

                <Button className="w-full rounded-xl bg-white text-blue-700 hover:bg-blue-50 border-none font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-11">
                    Get Started Now
                </Button>
            </div>

            {/* Decorative Shine */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 blur-3xl rounded-full pointer-events-none" />
        </div>
    );
}
