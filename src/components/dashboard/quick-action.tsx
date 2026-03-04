
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickActionProps {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    variant?: "blue" | "indigo" | "white";
}

export function QuickAction({ label, icon: Icon, onClick, variant = "white" }: QuickActionProps) {
    const variants = {
        blue: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200",
        indigo: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200",
        white: "bg-white text-gray-700 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 hover:text-blue-600"
    };

    return (
        <Button
            onClick={onClick}
            className={cn(
                "h-auto py-4 px-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center gap-3 w-full",
                variants[variant]
            )}
        >
            <Icon className="w-6 h-6" />
            <span className="font-medium">{label}</span>
        </Button>
    );
}
