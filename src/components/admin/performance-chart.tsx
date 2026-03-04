"use client";

import React from "react";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

interface PerformanceChartProps {
    data: any[];
}

const COLORS = ["#4F46E5", "#F97316", "#10B981", "#EF4444"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function PerformanceChart({ data }: PerformanceChartProps) {
    // Transform data for the chart if necessary, or assume it's passed in correctly
    // Mapped from backend: statusDistribution
    // Expected format: { status: string, _count: { status: number } }[]

    const chartData = data.map((item) => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' '),
        value: item._count.status,
    }));

    // If no data, show dummy data for visualization
    const finalData = chartData.length > 0 ? chartData : [
        { name: 'Excellent', value: 400 },
        { name: 'Good', value: 300 },
        { name: 'Average', value: 300 },
    ];

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex items-center justify-center">Loading chart...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm h-full min-h-[350px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Student Performance</h3>
            </div>
            <div className="h-[250px] w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={finalData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={renderCustomizedLabel}
                            labelLine={false}
                        >
                            {finalData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#374151', fontWeight: 600 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value, entry: any) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

}
