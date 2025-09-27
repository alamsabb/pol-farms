import * as React from "react"
import { cn } from "@/shared/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'ghost'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-white/80 backdrop-blur-sm border-slate-200/60 focus:bg-white focus:border-blue-300 focus:ring-blue-500/20",
      filled: "bg-slate-50/80 backdrop-blur-sm border-slate-200/60 focus:bg-white focus:border-blue-300 focus:ring-blue-500/20",
      ghost: "bg-transparent border-slate-200/60 focus:bg-white/50 focus:border-blue-300 focus:ring-blue-500/20"
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
          "placeholder:text-slate-400 placeholder:font-normal",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-slate-300 hover:shadow-sm",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }