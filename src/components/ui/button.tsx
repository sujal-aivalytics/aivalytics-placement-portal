import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-bold uppercase tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/15 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/25",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/15 hover:-translate-y-1 hover:shadow-lg hover:shadow-destructive/25",
        outline:
          "border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 shadow-sm hover:-translate-y-1 hover:shadow-md",
        secondary:
          "bg-gray-900 text-white hover:bg-black shadow-md hover:-translate-y-1 hover:shadow-lg",
        ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
        link: "text-primary underline-offset-4 hover:underline hover:opacity-70",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/15 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-600/25",
        warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/15 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/25",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        xl: "h-14 px-10 py-4 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
