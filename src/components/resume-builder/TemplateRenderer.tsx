"use client";

import React from "react";
import { ResumeData } from "@/components/resume-templates/types";
import {
    TemplateModernDark,
    TemplateElegantSerif,
    TemplateMinimalLines,
    TemplateCreativePattern,
    TemplateClassicFrame,
} from "@/components/resume-templates";

interface TemplateRendererProps {
    templateId: string;
    data: ResumeData;
    className?: string;
}

// Map of template IDs to their components
const templateComponents: Record<string, React.ComponentType<{ data: ResumeData }>> = {
    "modern-dark": TemplateModernDark,
    "elegant-serif": TemplateElegantSerif,
    "minimal-lines": TemplateMinimalLines,
    "creative-pattern": TemplateCreativePattern,
    "classic-frame": TemplateClassicFrame,
};

/**
 * TemplateRenderer - Renders the appropriate resume template based on templateId
 * Falls back to 'modern-dark' if templateId is not found
 */
export default function TemplateRenderer({
    templateId,
    data,
    className = "",
}: TemplateRendererProps) {
    // Get the template component or fallback to ModernDark
    const TemplateComponent = templateComponents[templateId] || templateComponents["modern-dark"];

    return (
        <div className={className}>
            <TemplateComponent data={data} />
        </div>
    );
}

/**
 * TemplateThumbnail - Renders a scaled-down version of a template for preview
 * Used in the template selection page
 */
export function TemplateThumbnail({
    templateId,
    data,
}: {
    templateId: string;
    data: ResumeData;
}) {
    const TemplateComponent = templateComponents[templateId] || templateComponents["modern-dark"];

    return (
        <div className="w-full aspect-[210/297] overflow-hidden relative bg-white border border-slate-200 rounded-lg">
            <div className="origin-top-left scale-[0.22] w-[210mm] h-[297mm] pointer-events-none select-none">
                <TemplateComponent data={data} />
            </div>
        </div>
    );
}
