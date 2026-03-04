"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, indicatorClassName, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-none bg-muted border border-border",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 bg-gradient-to-r from-primary to-primary/90 transition-all duration-500 ease-out", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }
