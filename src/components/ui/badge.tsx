import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white border-0 hover:bg-primary/90 shadow-sm",
        secondary:
          "bg-gray-900 text-white border-0 hover:bg-black shadow-sm",
        destructive:
          "bg-red-600 text-white border-0 hover:bg-red-700 shadow-sm",
        outline: "border border-border bg-background text-foreground hover:bg-accent",
        success: "bg-green-600 text-white border-0 hover:bg-green-700 shadow-sm",
        warning: "bg-amber-500 text-white border-0 hover:bg-amber-600 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
