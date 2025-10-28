"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { vendorSchema, type VendorFormData } from "@/shared/schemas/validation";
import { useEffect } from "react";

interface EditVendorFormProps {
  vendor: {
    _id?: string;
    name: string;
    company: string;
    contact: string;
    address: string;
  };
  onSubmit: (data: VendorFormData & { id: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function EditVendorForm({
  vendor,
  onSubmit,
  onCancel,
  isLoading,
}: EditVendorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: vendor.name,
      company: vendor.company,
      contact: vendor.contact,
      address: vendor.address,
    },
  });

  // Reset form when vendor changes
  useEffect(() => {
    reset({
      name: vendor.name,
      company: vendor.company,
      contact: vendor.contact,
      address: vendor.address,
    });
  }, [vendor, reset]);

  const handleFormSubmit = async (data: VendorFormData) => {
    try {
      if (!vendor._id) {
        console.error("Vendor ID is missing");
        return;
      }
      onSubmit({ ...data, id: vendor._id });
    } catch (err) {
      console.error("Error updating vendor:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Vendor Name</Label>
        <Input
          id="name"
          placeholder="Enter vendor name"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="company">Company Name</Label>
        <Input
          id="company"
          placeholder="Enter company name"
          {...register("company")}
          className={errors.company ? "border-red-500" : ""}
        />
        {errors.company && (
          <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contact">Contact Number</Label>
        <Input
          id="contact"
          placeholder="Enter contact number"
          {...register("contact")}
          className={errors.contact ? "border-red-500" : ""}
        />
        {errors.contact && (
          <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter address"
          {...register("address")}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? "Updating..." : "Update Vendor"}
        </Button>
      </div>
    </form>
  );
}
