'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { farmSchema, type FarmFormData } from '@/shared/schemas/validation'

interface AddFarmFormProps {
  onSubmit: (data: FarmFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function AddFarmForm({ onSubmit, onCancel, isLoading }: AddFarmFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Farm Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter farm name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="Enter location"
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          type="number"
          {...register('capacity', { valueAsNumber: true })}
          placeholder="Enter capacity"
          className={errors.capacity ? 'border-red-500' : ''}
        />
        {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Farm'}
        </Button>
      </div>
    </form>
  )
}