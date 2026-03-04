import { Users, BookOpen, Clock, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
    stats: {
        totalStudents: number;
        totalClasses: number;
        coursesInProgress: number;
        coursesCompleted: number;
    };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const items = [
        {
            label: "No of Students",
            value: stats.totalStudents,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            barColor: "bg-indigo-600",
        },
        {
            label: "No of Classes",
            value: stats.totalClasses,
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
            barColor: "bg-blue-600",
        },
        {
            label: "Course in progress",
            value: stats.coursesInProgress,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50",
            barColor: "bg-orange-600",
        },
        {
            label: "Course completed",
            value: stats.coursesCompleted,
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            barColor: "bg-emerald-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`${item.bg} rounded-2xl p-6 transition-all duration-200 hover:scale-105`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-white shadow-sm ${item.color}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        {/* <span className="text-xs font-medium text-gray-500">View all</span> */}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{item.value}</h3>
                    </div>
                    <div className={`w-12 h-1 mt-4 rounded-full ${item.barColor}`} />
                </div>
            ))}
        </div>
    );
}
