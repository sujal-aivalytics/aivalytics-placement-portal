import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface RecentStudentsTableProps {
    students: any[];
}

export function RecentStudentsTable({ students }: RecentStudentsTableProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Students Table</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500">Filter</Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">Sort</Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 bg-blue-50 hover:bg-blue-100">View all</Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="pb-4 font-semibold text-gray-500 text-sm pl-4">Student</th>
                            <th className="pb-4 font-semibold text-gray-500 text-sm">Company</th>
                            <th className="pb-4 font-semibold text-gray-500 text-sm">Stage</th>
                            <th className="pb-4 font-semibold text-gray-500 text-sm">Status</th>
                            <th className="pb-4 font-semibold text-gray-500 text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-4">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">No recent applications found.</td>
                            </tr>
                        ) : (
                            students.map((app) => (
                                <tr key={app.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 pl-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={app.user?.image || ""} />
                                                <AvatarFallback>{app.user?.name?.charAt(0) || "S"}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-gray-900">{app.user?.name || "Unknown"}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm text-gray-600 font-medium">{app.company}</td>
                                    <td className="py-3 text-sm text-gray-600">{app.currentStage || "Eligibility Check"}</td>
                                    <td className="py-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${app.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'}`}
                                        >
                                            {app.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4 text-gray-400" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
