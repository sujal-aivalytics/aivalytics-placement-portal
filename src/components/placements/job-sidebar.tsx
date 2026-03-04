
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle2, Share2, Globe, Mail } from "lucide-react";

interface JobSidebarProps {
    status: string;
    deadline: string;
    hrEmail: string;
    website: string;
}

export function JobSidebar({ status, deadline, hrEmail, website }: JobSidebarProps) {
    return (
        <div className="space-y-6">
            {/* Action Card */}
            <Card className="border-none shadow-lg shadow-blue-900/5 bg-white rounded-[24px] overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                <CardContent className="p-6 space-y-6">
                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Application Status</div>
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="font-bold text-gray-900 capitalize">{status.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-md font-medium text-lg">
                        View Application
                    </Button>

                    <div className="pt-4 border-t border-gray-100 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Deadline
                            </span>
                            <span className="font-medium text-gray-900">{deadline}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Eligibility
                            </span>
                            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">Eligible</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-gray-100 shadow-sm bg-white rounded-[24px]">
                <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-gray-900">Contact & Links</h3>
                    <div className="space-y-3 text-sm">
                        <a href={`mailto:${hrEmail}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Mail className="w-4 h-4" />
                            </div>
                            {hrEmail}
                        </a>
                        <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Globe className="w-4 h-4" />
                            </div>
                            Official Website
                        </a>
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 text-left">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <Share2 className="w-4 h-4" />
                            </div>
                            Share Opportunity
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
