'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFarm, deleteFarm, getFarms, updateFarm } from '@/lib/actions'
import { FarmFormData } from '@/shared/schemas/validation'

export function useFarms() {
  return useQuery({
    queryKey: ['farms'],
    queryFn: getFarms,
  })
}

export function useCreateFarm() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: FarmFormData) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('location', data.location)
      formData.append('capacity', data.capacity.toString())
      return createFarm(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] })
    },
  })
}

export function useDeleteFarm() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] })
    },
  })
}

export function useUpdateFarm() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { id: string, name: string, location: string, capacity: number }) => {
      const formData = new FormData()
      formData.append('id', data.id)
      formData.append('name', data.name)
      formData.append('location', data.location)
      formData.append('capacity', data.capacity.toString())
      return updateFarm(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] })
    },
  })
}