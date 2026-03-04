
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
    title: string;
    value: string;
    change?: string; // e.g., "+12.5%"
    trend?: "up" | "down" | "neutral";
    icon: LucideIcon;
    colorClass?: string; // e.g., "text-blue-600 bg-blue-50"
}

export function KpiCard({ title, value, change, trend = "neutral", icon: Icon, colorClass = "text-primary bg-primary/5" }: KpiCardProps) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 flex items-start justify-between">
                <div className="space-y-4">
                    <div className={cn("p-3 w-fit rounded-xl", colorClass)}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
                    </div>
                </div>

                {change && (
                    <div className={cn(
                        "flex items-center text-xs font-medium px-2.5 py-1 rounded-full",
                        trend === "up" ? "text-emerald-700 bg-emerald-50" :
                            trend === "down" ? "text-rose-700 bg-rose-50" : "text-gray-600 bg-gray-100"
                    )}>
                        {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
