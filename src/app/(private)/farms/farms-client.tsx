"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { AddFarmForm } from "@/shared/components/forms/add-farm-form";
import {
  Building2,
  MapPin,
  Users,
  Trash2,
  Plus,
  MoreVertical,
  Pencil,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Loader } from "@/shared/components/ui/loader";
import {
  useFarms,
  useCreateFarm,
  useDeleteFarm,
  useUpdateFarm,
} from "@/features/farms/hooks/use-farms";
import { FarmFormData } from "@/shared/schemas/validation";

export function FarmsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<string | null>(null);
  const { data: farms = [], isLoading } = useFarms();
  const createFarmMutation = useCreateFarm();
  const deleteFarmMutation = useDeleteFarm();
  const updateFarmMutation = useUpdateFarm();
  const [editOpen, setEditOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<any | null>(null);

  const handleAddFarm = async (data: FarmFormData) => {
    await createFarmMutation.mutateAsync(data);
    setIsModalOpen(false);
  };

  const handleDeleteFarmClick = (farmId: string) => {
    setFarmToDelete(farmId);
    setConfirmOpen(true);
  };

  const handleEditFarmClick = (farm: any) => {
    setEditingFarm(farm);
    setEditOpen(true);
  };

  const confirmDeleteFarm = async () => {
    if (!farmToDelete) return;
    await deleteFarmMutation.mutateAsync(farmToDelete);
    setConfirmOpen(false);
    setFarmToDelete(null);
  };

  if (isLoading) {
    return <Loader text="Loading Farms" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            Farm Management
          </h1>
          <p className="text-slate-600 font-medium">
            Manage your farm locations and capacity
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
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
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No farms added yet
                </h3>
                <p className="text-slate-500 mb-4">
                  Create your first farm to get started.
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Farm
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          farms.map((farm) => (
            <Card
              key={farm._id}
              className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
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
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={8}
                      className="w-44 rounded-xl border border-slate-200 bg-white shadow-xl p-1 z-50"
                    >
                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleEditFarmClick(farm)}
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1 h-px bg-slate-200" />
                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-red-50 cursor-pointer"
                        onClick={() => handleDeleteFarmClick(farm._id!)}
                      >
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-red-600">Delete</span>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{farm.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Capacity: {farm.capacity.toLocaleString("en-IN")} birds
                  </span>
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

      {/* Edit Farm Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Farm"
        size="md"
      >
        {editingFarm && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const formData = new FormData(form);
              const name = formData.get("name") as string;
              const location = formData.get("location") as string;
              const capacity = parseInt(formData.get("capacity") as string);
              await updateFarmMutation.mutateAsync({
                id: editingFarm._id,
                name,
                location,
                capacity,
              });
              setEditOpen(false);
              setEditingFarm(null);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={editingFarm.name}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-slate-700"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                defaultValue={editingFarm.location}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-slate-700"
              >
                Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                defaultValue={editingFarm.capacity}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={updateFarmMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateFarmMutation.isPending}>
                {updateFarmMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            Are you sure you want to delete this farm? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={deleteFarmMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteFarm}
              disabled={deleteFarmMutation.isPending}
            >
              {deleteFarmMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
