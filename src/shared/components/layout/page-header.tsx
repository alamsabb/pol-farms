import { LucideIcon } from "lucide-react"
import { cn } from "@/shared/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
  children?: React.ReactNode
}

export function PageHeader({ 
  title, 
  description, 
  icon: Icon, 
  className,
  children 
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4 animate-fade-in", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground text-lg mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
        {children && (
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}