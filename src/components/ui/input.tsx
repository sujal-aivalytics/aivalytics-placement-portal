import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-none border border-input bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 placeholder:font-normal focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15 focus-visible:border-primary focus-visible:bg-white hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 shadow-sm focus-visible:shadow-md",
          className
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
