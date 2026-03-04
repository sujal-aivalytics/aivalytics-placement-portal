
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

export function PlacementFilters() {
    return (
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100/50">
            <div className="flex items-center gap-2 mb-6 text-gray-800">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Filter className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Company</label>
                    <Select>
                        <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:ring-emerald-100 focus:border-emerald-300 hover:bg-gray-50 transition-colors">
                            <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tcs">TCS</SelectItem>
                            <SelectItem value="infosys">Infosys</SelectItem>
                            <SelectItem value="wipro">Wipro</SelectItem>
                            <SelectItem value="accenture">Accenture</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Status</label>
                    <Select>
                        <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:ring-emerald-100 focus:border-emerald-300 hover:bg-gray-50 transition-colors">
                            <SelectValue placeholder="Application Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="selected">Selected</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="applied">Applied</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Track</label>
                    <Select>
                        <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:ring-emerald-100 focus:border-emerald-300 hover:bg-gray-50 transition-colors">
                            <SelectValue placeholder="Job Role / Track" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sde">Software Developer</SelectItem>
                            <SelectItem value="analyst">Data Analyst</SelectItem>
                            <SelectItem value="consultant">Consultant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <Button className="flex-1 rounded-xl h-11 bg-blue-600 hover:bg-blue-700 font-medium shadow-blue-200 shadow-sm hover:shadow-md transition-all text-white">
                        Apply Filters
                    </Button>
                    <Button variant="ghost" className="h-11 w-11 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
