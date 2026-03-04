// Resume Templates - Barrel Export

export { default as TemplateModernDark } from "./TemplateModernDark";
export { default as TemplateElegantSerif } from "./TemplateElegantSerif";
export { default as TemplateMinimalLines } from "./TemplateMinimalLines";
export { default as TemplateCreativePattern } from "./TemplateCreativePattern";
export { default as TemplateClassicFrame } from "./TemplateClassicFrame";

export * from "./types";

// Template registry for dynamic loading
export const templateRegistry = {
    "modern-1": "TemplateModernDark",
    "modern-2": "TemplateCreativePattern",
    "professional-1": "TemplateElegantSerif",
    "professional-2": "TemplateClassicFrame",
    "creative-1": "TemplateMinimalLines",
    "creative-2": "TemplateCreativePattern",
} as const;

export type TemplateId = keyof typeof templateRegistry;
export type TemplateName = typeof templateRegistry[TemplateId];
