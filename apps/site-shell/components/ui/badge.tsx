import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-g2k-brass focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-g2k-border bg-g2k-bg-sunken text-g2k-fg-secondary",
        brass:
          "border-g2k-brass/20 bg-g2k-brass/10 text-g2k-brass",
        teal:
          "border-g2k-teal/20 bg-g2k-teal/10 text-g2k-teal",
        coral:
          "border-g2k-coral/20 bg-g2k-coral/10 text-g2k-coral",
        secondary:
          "border-transparent bg-g2k-teal/10 text-g2k-teal",
        destructive:
          "border-transparent bg-g2k-error/10 text-g2k-error",
        outline: 
          "text-g2k-fg-primary border-g2k-border",
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
