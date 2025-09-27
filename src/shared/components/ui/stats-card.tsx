import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/shared/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = "from-blue-500 to-blue-600",
  className 
}: StatsCardProps) {
  return (
    <div className={cn(
      "relative group overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl border border-white/20 p-6",
      "shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {value}
          </p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm font-semibold px-2 py-1 rounded-full",
                change.type === 'increase' 
                  ? "text-emerald-700 bg-emerald-50" 
                  : "text-red-700 bg-red-50"
              )}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-slate-500 ml-2">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-r shadow-lg group-hover:shadow-xl transition-all duration-300",
          iconColor
        )}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}