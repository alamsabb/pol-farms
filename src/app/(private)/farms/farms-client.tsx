'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Modal } from '@/shared/components/ui/modal'
import { AddFarmForm } from '@/shared/components/forms/add-farm-form'
import { Building2, MapPin, Users, Trash2, Plus } from 'lucide-react'
import { Loader } from '@/shared/components/ui/loader'
import { useFarms, useCreateFarm, useDeleteFarm } from '@/features/farms/hooks/use-farms'
import { FarmFormData } from '@/shared/schemas/validation'

export function FarmsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: farms = [], isLoading } = useFarms()
  const createFarmMutation = useCreateFarm()
  const deleteFarmMutation = useDeleteFarm()

  const handleAddFarm = async (data: FarmFormData) => {
    await createFarmMutation.mutateAsync(data)
    setIsModalOpen(false)
  }

  const handleDeleteFarm = (farmId: string) => {
    deleteFarmMutation.mutate(farmId)
  }

  if (isLoading) {
    return <Loader text="Loading Farms" />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Farm Management</h1>
          <p className="text-slate-600 font-medium">Manage your farm locations and capacity</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Farm</span>
        </Button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {farms.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No farms added yet</h3>
                <p className="text-slate-500 mb-4">Create your first farm to get started.</p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Farm
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          farms.map((farm) => (
            <Card key={farm._id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{farm.name}</CardTitle>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteFarm(farm._id!)}
                    disabled={deleteFarmMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{farm.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Capacity: {farm.capacity.toLocaleString('en-IN')} birds</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Farm Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Farm"
        size="md"
      >
        <AddFarmForm
          onSubmit={handleAddFarm}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createFarmMutation.isPending}
        />
      </Modal>
    </div>
  )
}