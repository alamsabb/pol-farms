"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  dailyRecordSchema,
  type DailyRecordFormData,
} from "@/shared/schemas/validation";

interface AddDailyRecordFormProps {
  batchId: string;
  onSubmit: (data: DailyRecordFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddDailyRecordForm({
  batchId,
  onSubmit,
  onCancel,
  isLoading,
}: AddDailyRecordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DailyRecordFormData>({
    resolver: zodResolver(dailyRecordSchema),
    defaultValues: { batchId },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          // max={new Date().toISOString().split('T')[0]}
          {...register("date")}
          className={errors.date ? "border-red-500" : ""}
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="feedKg">Feed Used (kg)</Label>
          <Input
            id="feedKg"
            type="number"
            step="0.01"
            {...register("feedKg", { valueAsNumber: true })}
            placeholder="Enter feed in kilograms"
            className={errors.feedKg ? "border-red-500" : ""}
          />
          {errors.feedKg && (
            <p className="text-red-500 text-sm mt-1">{errors.feedKg.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="feedCost">Feed Cost (₹)</Label>
          <Input
            id="feedCost"
            type="number"
            step="0.01"
            {...register("feedCost", { valueAsNumber: true })}
            placeholder="Enter feed cost"
            className={errors.feedCost ? "border-red-500" : ""}
          />
          {errors.feedCost && (
            <p className="text-red-500 text-sm mt-1">
              {errors.feedCost.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="mortality">Mortality Count</Label>
        <Input
          id="mortality"
          type="number"
          {...register("mortality", { valueAsNumber: true })}
          placeholder="Enter mortality count"
          className={errors.mortality ? "border-red-500" : ""}
        />
        {errors.mortality && (
          <p className="text-red-500 text-sm mt-1">
            {errors.mortality.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medicineUsed">Medicine Used - Optional</Label>
          <Input
            id="medicineUsed"
            {...register("medicineUsed")}
            placeholder="Enter medicine name"
            className={errors.medicineUsed ? "border-red-500" : ""}
          />
          {errors.medicineUsed && (
            <p className="text-red-500 text-sm mt-1">
              {errors.medicineUsed.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="medicineCost">Medicine Cost (₹) - Optional</Label>
          <Input
            id="medicineCost"
            type="number"
            step="0.01"
            {...register("medicineCost", { valueAsNumber: true })}
            placeholder="Enter medicine cost"
            className={errors.medicineCost ? "border-red-500" : ""}
          />
          {errors.medicineCost && (
            <p className="text-red-500 text-sm mt-1">
              {errors.medicineCost.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="averageWeight">Average Weight (kg) - Optional</Label>
        <Input
          id="averageWeight"
          type="number"
          step="0.01"
          {...register("averageWeight", { valueAsNumber: true })}
          placeholder="Enter average weight"
          className={errors.averageWeight ? "border-red-500" : ""}
        />
        {errors.averageWeight && (
          <p className="text-red-500 text-sm mt-1">
            {errors.averageWeight.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Notes - Optional</Label>
        <Input
          id="notes"
          {...register("notes")}
          placeholder="Enter any notes"
          className={errors.notes ? "border-red-500" : ""}
        />
        {errors.notes && (
          <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
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
          {isLoading ? "Adding..." : "Add Record"}
        </Button>
      </div>
    </form>
  );
}
