"use client";

import { useState } from "react";
import { Modal } from "@/shared/components/ui/modal";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AddDailyRecordForm } from "@/shared/components/forms/add-daily-record-form";
import { Plus, Calendar, Activity, TrendingDown, Weight } from "lucide-react";
import {
  formatCurrency,
  calculateFCR,
  calculateMortalityRate,
  formatPercent,
  calculateBatchAge,
} from "@/shared/utils";
import { DailyRecordFormData } from "@/shared/schemas/validation";

interface Batch {
  _id?: string;
  farmId: string;
  startDate: Date;
  initialChickCount: number;
  currentBirdCount: number;
  breed: string;
  supplier: string;
  costPerChick: number;
  status: string;
  totalMortality: number;
  totalFeedConsumed: number;
  totalBirdsSold: number;
  totalWeightSold: number;
}

interface Farm {
  _id?: string;
  name: string;
  location: string;
}

interface BatchDetailsModalProps {
  batch: Batch | null;
  farm: Farm | null;
  isOpen: boolean;
  onClose: () => void;
  onAddDailyRecord: (data: DailyRecordFormData) => void;
  isLoading?: boolean;
}

export function BatchDetailsModal({
  batch,
  farm,
  isOpen,
  onClose,
  onAddDailyRecord,
  isLoading,
}: BatchDetailsModalProps) {
  const [showRecordForm, setShowRecordForm] = useState(false);

  if (!batch) return null;

  const age = calculateBatchAge(batch.startDate);
  const mortalityRate = calculateMortalityRate(
    batch.totalMortality,
    batch.initialChickCount
  );
  const fcr = calculateFCR(batch.totalFeedConsumed, batch.totalWeightSold);
  const totalCost = batch.initialChickCount * batch.costPerChick;

  const handleAddRecord = (data: DailyRecordFormData) => {
    onAddDailyRecord(data);
    setShowRecordForm(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${batch.breed} - Batch Details`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Batch Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-slate-500">Age</p>
                  <p className="font-bold">{age} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-slate-500">Current Birds</p>
                  <p className="font-bold">
                    {batch.currentBirdCount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-xs text-slate-500">Mortality Rate</p>
                  <p className="font-bold text-red-600">
                    {formatPercent(mortalityRate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Weight className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-slate-500">FCR</p>
                  <p className="font-bold">{fcr || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Record Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Add Daily Record</CardTitle>
              {batch.status === "active" && !showRecordForm && (
                <Button
                  onClick={() => setShowRecordForm(true)}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Record</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {showRecordForm ? (
              <AddDailyRecordForm
                batchId={batch._id!}
                onSubmit={handleAddRecord}
                onCancel={() => setShowRecordForm(false)}
                isLoading={isLoading}
              />
            ) : (
              <p className="text-slate-500 text-center py-4">
                {batch.status === "active"
                  ? 'Click "Add Record" to track daily mortality and feed consumption'
                  : "This batch is no longer active"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}
