import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-g2k-brass text-g2k-bg-base shadow-g2k-sm hover:bg-g2k-brass-shine hover:shadow-g2k-glow focus-visible:ring-g2k-brass",
        destructive:
          "bg-g2k-error text-white shadow-sm hover:bg-g2k-error/90 focus-visible:ring-g2k-error",
        outline:
          "border-2 border-g2k-brass text-g2k-brass bg-transparent hover:bg-g2k-brass/10 focus-visible:ring-g2k-brass",
        secondary:
          "bg-g2k-teal text-white shadow-sm hover:bg-g2k-teal-oxidized focus-visible:ring-g2k-teal",
        ghost: 
          "text-g2k-fg-primary hover:bg-g2k-fg-primary/5 focus-visible:ring-g2k-brass",
        link: 
          "text-g2k-teal underline-offset-4 hover:underline hover:text-g2k-teal-oxidized",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 py-3 text-base",
        icon: "h-9 w-9",
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
