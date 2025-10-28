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
import { AddBatchForm } from "@/shared/components/forms/add-batch-form";
import { Egg, Plus, Calendar, Activity } from "lucide-react";
import {
  formatCurrency,
  calculateFCR,
  calculateMortalityRate,
  formatPercent,
} from "@/shared/utils";

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

import {
  useBatches,
  useCreateBatch,
} from "@/features/batches/hooks/use-batches";
import { useFarms } from "@/features/farms/hooks/use-farms";
import { Loader } from "@/shared/components/ui/loader";
import { BatchFormData } from "@/shared/schemas/validation";
import { useRouter } from "next/navigation";

export function BatchesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: batches = [], isLoading: batchesLoading } = useBatches();
  const { data: farms = [] } = useFarms();
  const createBatchMutation = useCreateBatch();

  const handleAddBatch = async (data: BatchFormData) => {
    try {
      await createBatchMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to create batch");
    }
  };

  const handleBatchClick = (batch: Batch) => {
    router.push(`/batches/${batch._id}`);
  };

  if (batchesLoading) {
    return <Loader text="Loading Batches" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            Batch Management
          </h1>
          <p className="text-slate-600 font-medium">
            Track your poultry batches and their lifecycle
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Batch</span>
        </Button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {batches.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <Egg className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No batches created yet
                </h3>
                <p className="text-slate-500 mb-4">
                  Create your first batch to get started.
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Batch
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          batches.map((batch) => {
            const farm = farms.find((f) => f._id === batch.farmId);
            const age = Math.floor(
              (Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const mortalityRate = calculateMortalityRate(
              batch.totalMortality,
              batch.initialChickCount
            );
            const fcr = calculateFCR(
              batch.totalFeedConsumed,
              batch.totalWeightSold
            );
            const totalCost = batch.initialChickCount * batch.costPerChick;

            return (
              <Card
                key={batch._id}
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => handleBatchClick(batch)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                        <Egg className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{batch.breed}</CardTitle>
                        <p className="text-sm text-slate-600 font-medium">
                          {farm?.name} - {farm?.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        batch.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : batch.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Age</p>
                        <p className="font-bold text-sm">{age} days</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Current Birds</p>
                        <p className="font-bold text-sm">
                          {batch.currentBirdCount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-500">Mortality Rate</p>
                      <p className="font-semibold text-red-600">
                        {formatPercent(mortalityRate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">FCR</p>
                      <p className="font-semibold">{fcr || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Feed Consumed</p>
                      <p className="font-semibold">
                        {batch.totalFeedConsumed} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Initial Cost</p>
                      <p className="font-semibold">
                        {formatCurrency(totalCost)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Supplier: {batch.supplier}</span>
                      <span>
                        Started: {batch.startDate.toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Batch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Batch"
        size="lg"
      >
        <AddBatchForm
          // farms={farms}
          onSubmit={handleAddBatch}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createBatchMutation.isPending}
        />
      </Modal>
    </div>
  );
}
