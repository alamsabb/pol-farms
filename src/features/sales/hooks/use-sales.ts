'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSale, getSales } from '@/lib/actions'
import { SaleFormData } from '@/shared/schemas/validation'

export function useSales() {
  return useQuery({
    queryKey: ['sales'],
    queryFn: getSales,
  })
}

export function useCreateSale() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: SaleFormData) => {
      const formData = new FormData()
      formData.append('batchId', data.batchId)
      formData.append('vendorId', data.vendorId)
      formData.append('date', data.date)
      formData.append('birdsSold', data.birdsSold.toString())
      formData.append('totalWeight', data.totalWeight.toString())
      formData.append('pricePerKg', data.pricePerKg.toString())
      
      const result = await createSale(formData)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })
}