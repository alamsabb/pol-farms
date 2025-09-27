'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { createFarm } from '../services/farm.service'
import { farmSchema, FarmFormData } from '@/shared/schemas'
import { Plus, Building2 } from 'lucide-react'

export default function FarmForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema)
  })

  const onSubmit = async (data: FarmFormData) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('location', data.location)
    formData.append('capacity', data.capacity.toString())
    
    await createFarm(formData)
    reset()
  }

  return (
    <Card className="glass-effect border-primary/20">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">Add New Farm</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Farm Name</span>
            </Label>
            <Input 
              id="name" 
              placeholder="Enter farm name" 
              {...register('name')} 
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Location</Label>
            <Input 
              id="location" 
              placeholder="Enter farm location" 
              {...register('location')} 
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.location.message}</span>
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium">Capacity (Birds)</Label>
            <Input 
              id="capacity" 
              type="number" 
              placeholder="Enter bird capacity" 
              {...register('capacity', { valueAsNumber: true })} 
              className={errors.capacity ? 'border-destructive' : ''}
            />
            {errors.capacity && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.capacity.message}</span>
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Farm
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}