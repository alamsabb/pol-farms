'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBatch, getBatches } from '@/lib/actions'
import { BatchFormData } from '@/shared/schemas/validation'

export function useBatches() {
  return useQuery({
    queryKey: ['batches'],
    queryFn: getBatches,
  })
}

export function useCreateBatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: BatchFormData) => {
      const formData = new FormData()
      formData.append('farmId', data.farmId)
      formData.append('startDate', data.startDate)
      formData.append('initialChickCount', data.initialChickCount.toString())
      formData.append('breed', data.breed)
      formData.append('supplier', data.supplier)
      formData.append('costPerChick', data.costPerChick.toString())
      return createBatch(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })
}