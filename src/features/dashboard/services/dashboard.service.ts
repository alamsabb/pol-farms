import { getFarms } from '@/features/farms/services/farm.service'
import { getBatches } from '@/features/batches/services/batch.service'
import { getSales } from '@/features/sales/services/sale.service'
import { calculateMortalityRate, calculateFCR } from '@/shared/utils'

export async function getDashboardData() {
  const [farms, batches, sales] = await Promise.all([
    getFarms(),
    getBatches(),
    getSales()
  ])

  const activeBatches = batches.filter(batch => batch.status === 'active')
  const totalActiveBirds = activeBatches.reduce((sum, batch) => sum + batch.currentBirdCount, 0)
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  
  const overallMortality = activeBatches.reduce((sum, batch) => sum + batch.totalMortality, 0)
  const overallInitialCount = activeBatches.reduce((sum, batch) => sum + batch.initialChickCount, 0)
  const mortalityRate = calculateMortalityRate(overallMortality, overallInitialCount)
  
  const totalFeedConsumed = activeBatches.reduce((sum, batch) => sum + batch.totalFeedConsumed, 0)
  const totalWeightSold = sales.reduce((sum, sale) => sum + sale.totalWeight, 0)
  const avgFCR = calculateFCR(totalFeedConsumed, totalWeightSold)

  return {
    farms,
    batches,
    sales,
    activeBatches,
    totalActiveBirds,
    totalRevenue,
    mortalityRate,
    avgFCR
  }
}