import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Farm } from '@/types'
import { deleteFarm } from '../services/farm.service'
import { Trash2, Building2, MapPin, Users, Sparkles } from 'lucide-react'

interface FarmListProps {
  farms: Farm[]
}

export default function FarmList({ farms }: FarmListProps) {
  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Building2 className="h-5 w-5 text-blue-400" />
          </div>
          <CardTitle className="text-xl">Existing Farms ({farms.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {farms.map((farm, index) => (
            <div 
              key={farm._id} 
              className="group flex items-center justify-between p-6 border border-border/50 rounded-xl bg-gradient-to-r from-accent/20 to-accent/10 hover:from-accent/30 hover:to-accent/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg flex items-center space-x-2">
                    <span>{farm.name}</span>
                    <Sparkles className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{farm.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{farm.capacity.toLocaleString()} birds</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <form action={deleteFarm}>
                <input type="hidden" name="id" value={farm._id} />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  type="submit"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ))}
          
          {farms.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="p-4 rounded-full bg-muted/20 w-16 h-16 mx-auto flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">
                  No farms added yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Create your first farm to get started with poultry management
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}