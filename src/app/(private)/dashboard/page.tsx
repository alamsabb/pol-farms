import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import MetricsCards from '@/features/dashboard/components/metrics-cards'
import { getDashboardData } from '@/features/dashboard/services/dashboard.service'
import { PageHeader } from '@/shared/components/layout/page-header'
import { Clock, TrendingUp, Activity, Home } from 'lucide-react'

export default async function DashboardPage() {
  const { 
    farms, 
    activeBatches, 
    totalActiveBirds, 
    totalRevenue, 
    mortalityRate, 
    avgFCR 
  } = await getDashboardData()

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's what's happening with your poultry farm today."
        icon={Home}
      />
      
      <MetricsCards 
        totalActiveBirds={totalActiveBirds}
        totalFarms={farms.length}
        mortalityRate={mortalityRate}
        totalRevenue={totalRevenue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <CardTitle>Active Batches</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeBatches.slice(0, 5).map((batch, index) => (
                <div key={batch._id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div>
                      <p className="font-medium">{batch.farmName}</p>
                      <p className="text-sm text-muted-foreground">
                        {batch.currentBirdCount} birds • {batch.breed}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {Math.floor((new Date().getTime() - new Date(batch.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <CardTitle>Key Performance Indicators</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Average FCR', value: avgFCR, color: 'blue' },
                { label: 'Active Batches', value: activeBatches.length, color: 'green' },
                { label: 'Livability Rate', value: `${(100 - mortalityRate).toFixed(2)}%`, color: 'purple' },
              ].map((kpi, index) => (
                <div key={kpi.label} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${kpi.color}-400`} />
                    <span className="text-sm font-medium">{kpi.label}</span>
                  </div>
                  <span className="font-bold text-lg">{kpi.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}