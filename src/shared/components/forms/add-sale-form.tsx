"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { type SaleFormData } from "@/shared/schemas/validation";
import { useSaleValidation } from "@/features/sales/hooks/use-sale-validation";
import { useVendors } from "@/features/vendors/hooks/use-vendors";
import { useEffect, useState } from "react";

interface AddSaleFormProps {
  onSubmit: (data: SaleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddSaleForm({
  onSubmit,
  onCancel,
  isLoading,
}: AddSaleFormProps) {
  const { batches } = useSaleValidation();
  const { data: vendors = [] } = useVendors();
  const [customErrors, setCustomErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm<SaleFormData>();

  const selectedBatchId = watch("batchId");
  const birdsSold = watch("birdsSold");
  const selectedBatch = batches.find(
    (b) =>
      b._id === selectedBatchId &&
      b.status === "active" &&
      b.currentBirdCount > 0
  );

  // Custom validation for bird availability
  useEffect(() => {
    if (selectedBatch && birdsSold) {
      if (birdsSold > selectedBatch.currentBirdCount) {
        setCustomErrors((prev) => ({
          ...prev,
          birdsSold: `Only ${selectedBatch.currentBirdCount} birds available in this batch`,
        }));
      } else {
        setCustomErrors((prev) => {
          const { birdsSold, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [selectedBatch, birdsSold]);

  // Reset when batch changes
  useEffect(() => {
    if (selectedBatchId && selectedBatch) {
      setValue("birdsSold", 0);
      setCustomErrors({});
    }
  }, [selectedBatchId, selectedBatch, setValue]);

  const handleFormSubmit = (data: SaleFormData) => {
    // Check custom validation
    if (Object.keys(customErrors).length > 0) return;
    if (!selectedBatch) return;

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="batchId">Batch</Label>
        <Controller
          name="batchId"
          control={control}
          rules={{ required: "Batch selection is required" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={errors.batchId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches
                  .filter(
                    (b) => b.status === "active" && b.currentBirdCount > 0
                  )
                  .map((batch) => (
                    <SelectItem key={batch._id} value={batch._id!}>
                      {batch.breed} - {batch.currentBirdCount} birds available
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.batchId && (
          <p className="text-red-500 text-sm mt-1">{errors.batchId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="vendorId">Vendor</Label>
        <Controller
          name="vendorId"
          control={control}
          rules={{ required: "Vendor selection is required" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={errors.vendorId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor._id} value={vendor._id!}>
                    {vendor.name} - {vendor.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.vendorId && (
          <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="date">Sale Date</Label>
        <Input
          id="date"
          type="date"
          // max={new Date().toISOString().split("T")[0]}
          {...register("date", { required: "Sale date is required" })}
          className={errors.date ? "border-red-500" : ""}
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="birdsSold">Birds Sold</Label>
        <Input
          id="birdsSold"
          type="number"
          max={selectedBatch?.currentBirdCount || 0}
          {...register("birdsSold", {
            valueAsNumber: true,
            required: "Birds sold is required",
            min: { value: 1, message: "Must sell at least 1 bird" },
          })}
          placeholder={
            selectedBatch
              ? `Max: ${selectedBatch.currentBirdCount}`
              : "Select batch first"
          }
          disabled={!selectedBatch}
          className={
            errors.birdsSold || customErrors.birdsSold ? "border-red-500" : ""
          }
        />
        {(errors.birdsSold || customErrors.birdsSold) && (
          <p className="text-red-500 text-sm mt-1">
            {errors.birdsSold?.message || customErrors.birdsSold}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="totalWeight">Total Weight (Kg)</Label>
        <Input
          id="totalWeight"
          type="number"
          step="0.01"
          {...register("totalWeight", {
            valueAsNumber: true,
            required: "Total weight is required",
            min: { value: 0.1, message: "Weight must be greater than 0" },
          })}
          placeholder="Enter weight"
          className={errors.totalWeight ? "border-red-500" : ""}
        />
        {errors.totalWeight && (
          <p className="text-red-500 text-sm mt-1">
            {errors.totalWeight.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="pricePerKg">Price per Kg (₹)</Label>
        <Input
          id="pricePerKg"
          type="number"
          step="0.01"
          {...register("pricePerKg", {
            valueAsNumber: true,
            required: "Price per kg is required",
            min: { value: 0.01, message: "Price must be greater than 0" },
          })}
          placeholder="Enter price"
          className={errors.pricePerKg ? "border-red-500" : ""}
        />
        {errors.pricePerKg && (
          <p className="text-red-500 text-sm mt-1">
            {errors.pricePerKg.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isLoading ||
            !selectedBatch ||
            Object.keys(errors).length > 0 ||
            Object.keys(customErrors).length > 0
          }
        >
          {isLoading ? "Recording..." : "Record Sale"}
        </Button>
      </div>
    </form>
  );
}
