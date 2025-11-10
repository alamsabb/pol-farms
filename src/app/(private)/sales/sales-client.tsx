"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { AddSaleForm } from "@/shared/components/forms/add-sale-form";
import { StatsCard } from "@/shared/components/ui/stats-card";
import { TrendingUp, Plus, Calendar, Weight, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/shared/utils";
import { Loader } from "@/shared/components/ui/loader";
import { useSales, useCreateSale } from "@/features/sales/hooks/use-sales";
import { useBatches } from "@/features/batches/hooks/use-batches";
import { useVendors } from "@/features/vendors/hooks/use-vendors";
import { SaleFormData } from "@/shared/schemas/validation";


export function SalesClient() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: sales = [], isLoading: salesLoading } = useSales();
  const { data: batches = [] } = useBatches();
  const { data: vendors = [] } = useVendors();
  const createSaleMutation = useCreateSale();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalBirdsSold = sales.reduce((sum, sale) => sum + sale.birdsSold, 0);
  const totalWeightSold = sales.reduce(
    (sum, sale) => sum + sale.totalWeight,
    0
  );

  const handleAddSale = async (data: SaleFormData) => {
    try {
      await createSaleMutation.mutateAsync(data);
      setIsModalOpen(false);
      router.refresh(); // Refresh server components (dashboard)
    } catch (error: any) {
      alert(error.message || 'Failed to record sale');
    }
  };
  
  if (salesLoading) {
    return <Loader text="Loading Sales" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            Sales Management
          </h1>
          <p className="text-slate-600 font-medium">
            Record sales and track revenue
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Record Sale</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={IndianRupee}
          iconColor="from-emerald-500 to-emerald-600"
          change={{ value: 15.2, type: "increase" }}
        />
        <StatsCard
          title="Birds Sold"
          value={totalBirdsSold.toLocaleString("en-IN")}
          icon={TrendingUp}
          iconColor="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Weight Sold"
          value={`${totalWeightSold} kg`}
          icon={Weight}
          iconColor="from-purple-500 to-purple-600"
        />
      </div>

      {/* Sales Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {sales.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No sales recorded yet
                </h3>
                <p className="text-slate-500 mb-4">
                  Record your first sale to get started.
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Your First Sale
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          sales.map((sale) => {
            const batch = batches.find((b) => b._id === sale.batchId);
            const vendor = vendors.find((v) => v._id === sale.vendorId);
            const averageWeight = sale.totalWeight / sale.birdsSold;

            return (
              <Card
                key={sale._id}
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {batch?.breed} Sale
                        </CardTitle>
                        <p className="text-sm text-slate-600 font-medium">
                          Sold to: {vendor?.name} ({vendor?.company})
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>{sale.date.toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Birds Sold</p>
                      <p className="font-bold">
                        {sale.birdsSold.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Total Weight</p>
                      <p className="font-bold">{sale.totalWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Price per Kg</p>
                      <p className="font-bold">
                        {formatCurrency(sale.pricePerKg)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Avg. Bird Weight</p>
                      <p className="font-bold">{averageWeight.toFixed(2)} kg</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Contact: {vendor?.contact}</span>
                      <span>ID: {sale._id?.slice(-8)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Sale Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Sale"
        size="lg"
      >
        <AddSaleForm
          onSubmit={handleAddSale}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createSaleMutation.isPending}
        />
      </Modal>
    </div>
  );
}
