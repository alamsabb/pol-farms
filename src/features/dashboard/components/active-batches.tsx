"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { calculateMortalityRate, calculateBatchAge } from "@/shared/utils";
import { Egg, Calendar } from "lucide-react";
import { Batch, Farm } from "@/types";

interface ActiveBatchesProps {
  activeBatches: Batch[];
  farms: Farm[];
}

export default function ActiveBatches({
  activeBatches,
  farms,
}: ActiveBatchesProps) {
  const router = useRouter();

  const handleBatchClick = (batchId: string | undefined) => {
    if (batchId) {
      router.push(`/batches/${batchId}`);
    }
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Egg className="h-5 w-5 text-orange-600" />
          <span>Active Batches</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeBatches.length === 0 ? (
          <div className="text-center py-12">
            <Egg className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No active batches</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBatches.map((batch) => {
              const age = calculateBatchAge(batch.startDate);
              const farm = farms.find((f) => f._id === batch.farmId);

              return (
                <div
                  key={batch._id}
                  onClick={() => handleBatchClick(batch._id)}
                  className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 space-y-3 sm:space-y-0 cursor-pointer hover:border-orange-200"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                      <Egg className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-orange-600 transition-colors">
                        {batch.breed} - {farm?.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-slate-600 mt-1 space-y-1 sm:space-y-0">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Age: {age} days</span>
                        </span>
                        <span>
                          Birds:{" "}
                          {batch.currentBirdCount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-sm sm:text-base text-slate-800">
                      Mortality: {batch.totalMortality}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Rate:{" "}
                      {calculateMortalityRate(
                        batch.totalMortality,
                        batch.initialChickCount
                      )}
                      %
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
