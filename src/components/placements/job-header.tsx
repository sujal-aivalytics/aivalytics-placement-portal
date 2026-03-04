
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Briefcase, DollarSign } from "lucide-react";

interface JobHeaderProps {
    company: string;
    role: string;
    location: string;
    salary: string;
    type: string;
    postedAt: string;
    logoUrl?: string;
}

export function JobHeader({ company, role, location, salary, type, postedAt, logoUrl }: JobHeaderProps) {
    return (
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100/50 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-emerald-100/50 transition-colors duration-500" />

            <div className="relative flex flex-col md:flex-row gap-6 items-start">
                {/* Logo */}
                <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center p-4">
                    {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt={company} className="w-full h-full object-contain" />
                    ) : (
                        <Building2 className="w-10 h-10 text-gray-400" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{role}</h1>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 px-3">
                                {type}
                            </Badge>
                        </div>
                        <div className="text-lg font-medium text-gray-600 flex items-center gap-2">
                            {company}
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500 font-normal">Posted {postedAt}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {location}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            0-2 Years Exp.
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            {salary}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
