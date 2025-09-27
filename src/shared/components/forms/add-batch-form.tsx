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
import { batchSchema, type BatchFormData } from "@/shared/schemas/validation";
import { useFarms } from "@/features/farms/hooks/use-farms";

interface Farm {
  _id?: string;
  name: string;
  location: string;
}
interface AddBatchFormProps {
  // farms: Farm[]; // ✅ Added farms
  onSubmit: (data: BatchFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddBatchForm({
  onSubmit,
  onCancel,
  isLoading,
}: AddBatchFormProps) {
  const { data: farms = [] } = useFarms();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="farmId">Farm</Label>
        <Controller
          name="farmId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={errors.farmId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select farm" />
              </SelectTrigger>
              <SelectContent>
                {farms.map((farm) => (
                  <SelectItem key={farm._id} value={farm._id!}>
                    {farm.name} - {farm.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.farmId && (
          <p className="text-red-500 text-sm mt-1">{errors.farmId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          {...register("startDate")}
          className={errors.startDate ? "border-red-500" : ""}
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.startDate.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="initialChickCount">Initial Chick Count</Label>
        <Input
          id="initialChickCount"
          type="number"
          {...register("initialChickCount", { valueAsNumber: true })}
          placeholder="Enter count"
          className={errors.initialChickCount ? "border-red-500" : ""}
        />
        {errors.initialChickCount && (
          <p className="text-red-500 text-sm mt-1">
            {errors.initialChickCount.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="breed">Breed/Strain</Label>
        <Input
          id="breed"
          {...register("breed")}
          placeholder="Enter breed"
          className={errors.breed ? "border-red-500" : ""}
        />
        {errors.breed && (
          <p className="text-red-500 text-sm mt-1">{errors.breed.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="supplier">Supplier</Label>
        <Input
          id="supplier"
          {...register("supplier")}
          placeholder="Enter supplier name"
          className={errors.supplier ? "border-red-500" : ""}
        />
        {errors.supplier && (
          <p className="text-red-500 text-sm mt-1">{errors.supplier.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="costPerChick">Cost per Chick (₹)</Label>
        <Input
          id="costPerChick"
          type="number"
          step="0.01"
          {...register("costPerChick", { valueAsNumber: true })}
          placeholder="Enter cost"
          className={errors.costPerChick ? "border-red-500" : ""}
        />
        {errors.costPerChick && (
          <p className="text-red-500 text-sm mt-1">
            {errors.costPerChick.message}
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Batch"}
        </Button>
      </div>
    </form>
  );
}
