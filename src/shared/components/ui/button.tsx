import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25",
          "hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
        ],
        destructive: [
          "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25",
          "hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-lg"
        ],
        outline: [
          "border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 shadow-sm",
          "hover:bg-slate-50 hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5",
          "active:translate-y-0"
        ],
        secondary: [
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 shadow-sm",
          "hover:from-slate-200 hover:to-slate-300 hover:shadow-md hover:-translate-y-0.5",
          "active:translate-y-0"
        ],
        ghost: [
          "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
          "hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
        ],
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
        success: [
          "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25",
          "hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
        ],
        warning: [
          "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25",
          "hover:from-amber-600 hover:to-orange-700 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
        ]
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        xl: "h-16 px-10 text-lg",
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