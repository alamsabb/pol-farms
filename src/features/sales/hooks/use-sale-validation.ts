'use client'

import { z } from 'zod'
import { useBatches } from '@/features/batches/hooks/use-batches'

export function useSaleValidation() {
  const { data: batches = [] } = useBatches()
  
  const createSaleSchema = (selectedBatchId?: string) => {
    const selectedBatch = batches.find(b => b._id === selectedBatchId)
    const maxBirds = selectedBatch?.currentBirdCount || 0
    
    return z.object({
      batchId: z.string().min(1, 'Batch selection is required'),
      vendorId: z.string().min(1, 'Vendor selection is required'),
      date: z.string().min(1, 'Sale date is required').refine((date) => {
        const selectedDate = new Date(date)
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        return selectedDate <= today
      }, 'Sale date cannot be in the future'),
      birdsSold: z.number()
        .min(1, 'Birds sold must be at least 1')
        .max(maxBirds, `Only ${maxBirds} birds available in selected batch`),
      totalWeight: z.number().min(0.1, 'Total weight must be greater than 0').max(100000, 'Weight too large'),
      pricePerKg: z.number().min(0.01, 'Price per kg must be greater than 0').max(10000, 'Price too high')
    })
  }
  
  return { createSaleSchema, batches }
}