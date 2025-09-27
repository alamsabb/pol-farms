'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDailyRecord } from '@/lib/actions'
import { DailyRecordFormData } from '@/shared/schemas/validation'

export function useCreateDailyRecord() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: DailyRecordFormData) => {
      const formData = new FormData()
      formData.append('batchId', data.batchId)
      formData.append('date', data.date)
      formData.append('feedBags', data.feedBags.toString())
      formData.append('feedCost', data.feedCost.toString())
      formData.append('mortality', data.mortality.toString())
      if (data.medicineUsed) formData.append('medicineUsed', data.medicineUsed)
      if (data.medicineCost) formData.append('medicineCost', data.medicineCost.toString())
      if (data.averageWeight) formData.append('averageWeight', data.averageWeight.toString())
      if (data.notes) formData.append('notes', data.notes)
      
      const result = await createDailyRecord(formData)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })
}