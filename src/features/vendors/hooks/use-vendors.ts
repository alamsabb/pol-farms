'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createVendor, getVendors } from '@/lib/actions'
import { VendorFormData } from '@/shared/schemas/validation'

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors,
  })
}

export function useCreateVendor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: VendorFormData) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('company', data.company)
      formData.append('contact', data.contact)
      formData.append('address', data.address)
      return createVendor(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
    },
  })
}