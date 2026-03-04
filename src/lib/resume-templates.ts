// Resume Templates Registry
// Central configuration for all available resume templates

import { ResumeData } from "@/components/resume-templates/types";

export interface TemplateConfig {
    id: string;
    name: string;
    component: string;
    description: string;
    category: "modern" | "professional" | "creative";
}

export const RESUME_TEMPLATES: TemplateConfig[] = [
    {
        id: "modern-dark",
        name: "Modern Classic",
        component: "TemplateModernDark",
        description: "Dark header with initials box and progress bar languages",
        category: "modern",
    },
    {
        id: "elegant-serif",
        name: "Elegant Serif",
        component: "TemplateElegantSerif",
        description: "Centered layout with circle monogram and serif fonts",
        category: "professional",
    },
    {
        id: "minimal-lines",
        name: "Modern Minimal",
        component: "TemplateMinimalLines",
        description: "Clean design with double horizontal lines",
        category: "modern",
    },
    {
        id: "creative-pattern",
        name: "Creative Pattern",
        component: "TemplateCreativePattern",
        description: "Dark dotted sidebar with colorful accents",
        category: "creative",
    },
    {
        id: "classic-frame",
        name: "Executive",
        component: "TemplateClassicFrame",
        description: "Traditional framed layout with gray header",
        category: "professional",
    },
];

// Get template by ID with fallback to default
export function getTemplateById(id: string): TemplateConfig {
    return RESUME_TEMPLATES.find((t) => t.id === id) || RESUME_TEMPLATES[0];
}

// Get templates by category
export function getTemplatesByCategory(category: TemplateConfig["category"]): TemplateConfig[] {
    return RESUME_TEMPLATES.filter((t) => t.category === category);
}
