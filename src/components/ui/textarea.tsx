import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-none border border-input bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15 focus-visible:border-primary focus-visible:bg-white hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 shadow-sm focus-visible:shadow-md resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
