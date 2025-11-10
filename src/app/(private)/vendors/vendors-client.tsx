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
import { AddVendorForm } from "@/shared/components/forms/add-vendor-form";
import { EditVendorForm } from "@/shared/components/forms/edit-vendor-form";
import {
  Users,
  Phone,
  MapPin,
  Building,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface Vendor {
  _id?: string;
  name: string;
  company: string;
  contact: string;
  address: string;
}

import {
  useVendors,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
} from "@/features/vendors/hooks/use-vendors";
import { Loader } from "@/shared/components/ui/loader";
import { VendorFormData } from "@/shared/schemas/validation";

export function VendorsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const { data: vendors = [], isLoading } = useVendors();
  const createVendorMutation = useCreateVendor();
  const updateVendorMutation = useUpdateVendor();
  const deleteVendorMutation = useDeleteVendor();

  const handleAddVendor = async (data: VendorFormData) => {
    try {
      await createVendorMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to create vendor");
    }
  };

  const handleDeleteVendorClick = (vendorId: string) => {
    setVendorToDelete(vendorId);
    setConfirmOpen(true);
  };

  const handleEditVendorClick = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setEditOpen(true);
  };

  const confirmDeleteVendor = async () => {
    if (!vendorToDelete) return;
    await deleteVendorMutation.mutateAsync(vendorToDelete);
    setConfirmOpen(false);
    setVendorToDelete(null);
  };

  if (isLoading) {
    return <Loader text="Loading Vendors" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            Vendor Management
          </h1>
          <p className="text-slate-600 font-medium">
            Manage your customers and vendors
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vendor</span>
        </Button>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {vendors.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No vendors added yet
                </h3>
                <p className="text-slate-500 mb-4">
                  Create your first vendor to get started.
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Vendor
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          vendors.map((vendor) => (
            <Card
              key={vendor._id}
              className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <div className="flex items-center space-x-1 text-sm text-slate-600">
                        <Building className="h-3 w-3" />
                        <span className="font-medium">{vendor.company}</span>
                      </div>
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
                        onClick={() => handleEditVendorClick(vendor)}
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1 h-px bg-slate-200" />
                      <DropdownMenu.Item
                        className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-red-50 cursor-pointer"
                        onClick={() => handleDeleteVendorClick(vendor._id!)}
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
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">{vendor.contact}</span>
                </div>
                <div className="flex items-start space-x-2 text-slate-600">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span className="text-sm font-medium">{vendor.address}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Vendor"
        size="md"
      >
        <AddVendorForm
          onSubmit={handleAddVendor}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createVendorMutation.isPending}
        />
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingVendor(null);
        }}
        title="Edit Vendor"
        size="md"
      >
        {editingVendor && (
          <EditVendorForm
            vendor={editingVendor}
            onSubmit={async (data) => {
              await updateVendorMutation.mutateAsync({
                ...data,
                id: editingVendor._id!,
              });
              setEditOpen(false);
              setEditingVendor(null);
            }}
            onCancel={() => {
              setEditOpen(false);
              setEditingVendor(null);
            }}
            isLoading={updateVendorMutation.isPending}
          />
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
            Are you sure you want to delete this vendor? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={deleteVendorMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteVendor}
              disabled={deleteVendorMutation.isPending}
            >
              {deleteVendorMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
