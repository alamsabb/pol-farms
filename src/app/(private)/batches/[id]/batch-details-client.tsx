"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Modal } from "@/shared/components/ui/modal";
import { Pagination } from "@/shared/components/ui/pagination";
import { AddDailyRecordForm } from "@/shared/components/forms/add-daily-record-form";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Activity,
  TrendingDown,
  Weight,
  IndianRupee,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  formatCurrency,
  calculateFCR,
  calculateMortalityRate,
  formatPercent,
} from "@/shared/utils";
import { useBatches } from "@/features/batches/hooks/use-batches";
import { useFarms } from "@/features/farms/hooks/use-farms";
import { useSales } from "@/features/sales/hooks/use-sales";
import { useVendors } from "@/features/vendors/hooks/use-vendors";
import {
  useCreateDailyRecord,
  useDailyRecords,
} from "@/features/batches/hooks/use-daily-records";
import { DailyRecordFormData } from "@/shared/schemas/validation";
import { Loader } from "@/shared/components/ui/loader";

interface BatchDetailsClientProps {
  batchId: string;
}

export function BatchDetailsClient({ batchId }: BatchDetailsClientProps) {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [salesExpanded, setSalesExpanded] = useState(false);
  const [recordsExpanded, setRecordsExpanded] = useState(false);
  const [salesPage, setSalesPage] = useState(1);
  const [recordsPage, setRecordsPage] = useState(1);
  const recordsPerPage = 5;
  const router = useRouter();
  const { data: batches = [], isLoading: isBatchesLoading } = useBatches();
  const { data: farms = [], isLoading: isFarmsLoading } = useFarms();
  const { data: sales = [], isLoading: isSalesLoading } = useSales();
  const { data: vendors = [], isLoading: isVendorsLoading } = useVendors();
  const createDailyRecordMutation = useCreateDailyRecord();
  const { data: dailyRecords = [], isLoading: isDailyLoading } =
    useDailyRecords(batchId);

  const batch = batches.find((b) => b._id === batchId);
  const farm = farms.find((f) => f._id === batch?.farmId);
  const batchSales = sales.filter((s) => s.batchId === batchId);
  const totalRevenue = batchSales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );

  // Pagination logic
  const totalSalesPages = Math.ceil(batchSales.length / recordsPerPage);
  const paginatedSales = batchSales.slice(
    (salesPage - 1) * recordsPerPage,
    salesPage * recordsPerPage
  );

  const totalRecordsPages = Math.ceil(dailyRecords.length / recordsPerPage);
  const paginatedRecords = dailyRecords.slice(
    (recordsPage - 1) * recordsPerPage,
    recordsPage * recordsPerPage
  );

  const handleAddRecord = async (data: DailyRecordFormData) => {
    try {
      await createDailyRecordMutation.mutateAsync(data);
      setIsRecordModalOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to add daily record");
    }
  };

  const isAnyLoading =
    isBatchesLoading ||
    isFarmsLoading ||
    isSalesLoading ||
    isVendorsLoading ||
    isDailyLoading;

  if (isAnyLoading) {
    return <Loader text="Loading Batch Details" />;
  }

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-slate-600 mb-4">Batch not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const age = Math.floor(
    (Date.now() - batch.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const mortalityRate = calculateMortalityRate(
    batch.totalMortality,
    batch.initialChickCount
  );
  const fcr = calculateFCR(batch.totalFeedConsumed, batch.totalWeightSold);
  const totalCost = batch.initialChickCount * batch.costPerChick;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              {batch.breed} - Batch Details
            </h1>
            <p className="text-slate-600">
              {farm?.name} - {farm?.location}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {batch.status === "active" && (
            <Button
              onClick={() => setIsRecordModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Daily Record</span>
            </Button>
          )}
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              batch.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {batch.status}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-slate-500">Age</p>
                <p className="text-2xl font-bold">{age} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-slate-500">Current Birds</p>
                <p className="text-2xl font-bold">
                  {batch.currentBirdCount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-slate-500">Mortality Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatPercent(mortalityRate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Weight className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-slate-500">FCR</p>
                <p className="text-2xl font-bold">{fcr || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <IndianRupee className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-sm text-slate-500">Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Breed:</span>
              <span className="font-medium">{batch.breed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Supplier:</span>
              <span className="font-medium">{batch.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Start Date:</span>
              <span className="font-medium">
                {batch.startDate.toLocaleDateString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cost per Chick:</span>
              <span className="font-medium">
                {formatCurrency(batch.costPerChick)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Initial Chicks:</span>
              <span className="font-medium">
                {batch.initialChickCount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Mortality:</span>
              <span className="font-medium text-red-600">
                {batch.totalMortality}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Birds Sold:</span>
              <span className="font-medium">{batch.totalBirdsSold}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Feed Consumed:</span>
              <span className="font-medium">{batch.totalFeedConsumed} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Initial Investment:</span>
              <span className="font-medium">{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Production Cost:</span>
              <span className="font-medium">
                {formatCurrency(batch.totalProductionCost || 0)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-slate-600 font-semibold">Total Cost:</span>
              <span className="font-bold">
                {formatCurrency(totalCost + (batch.totalProductionCost || 0))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Records Accordion */}
      <Card>
        <CardHeader>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setSalesExpanded(!salesExpanded)}
          >
            <CardTitle className="flex items-center space-x-2">
              <span>Sales Records ({batchSales.length})</span>
            </CardTitle>
            {salesExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {salesExpanded && (
          <CardContent>
            {batchSales.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  No sales recorded for this batch yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedSales.map((sale) => {
                  const vendor = vendors.find((v) => v._id === sale.vendorId);
                  return (
                    <div key={sale._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {vendor?.name} ({vendor?.company})
                          </p>
                          <p className="text-sm text-slate-600">
                            {sale.date.toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">
                            {formatCurrency(sale.totalAmount)}
                          </p>
                          <p className="text-sm text-slate-600">
                            {sale.birdsSold} birds • {sale.totalWeight} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Pagination
                  currentPage={salesPage}
                  totalPages={totalSalesPages}
                  onPageChange={setSalesPage}
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Daily Records Accordion */}
      <Card>
        <CardHeader>
          <div
            className="flex items-center  justify-between space-x-2 cursor-pointer"
            onClick={() => setRecordsExpanded(!recordsExpanded)}
          >
            <CardTitle>Daily Records ({dailyRecords.length})</CardTitle>
            {recordsExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {recordsExpanded && (
          <CardContent>
            {dailyRecords.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  {batch.status === "active"
                    ? 'No daily records yet. Click "Add Record" to start tracking.'
                    : "No daily records for this batch"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedRecords.map((record) => (
                  <div key={record._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {record.date.toLocaleDateString("en-IN")}
                        </p>
                        <p className="text-sm text-slate-600">
                          Feed: {record.feedKg} kg • Mortality:{" "}
                          {record.mortality}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {formatCurrency(
                            (record.feedCost || 0) + (record.medicineCost || 0)
                          )}
                        </p>
                        <p className="text-sm text-slate-600">Daily Cost</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Pagination
                  currentPage={recordsPage}
                  totalPages={totalRecordsPages}
                  onPageChange={setRecordsPage}
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Add Daily Record Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Add Daily Record"
        size="lg"
      >
        <AddDailyRecordForm
          batchId={batch._id!}
          onSubmit={handleAddRecord}
          onCancel={() => setIsRecordModalOpen(false)}
          isLoading={createDailyRecordMutation.isPending}
        />
      </Modal>
    </div>
  );
}
