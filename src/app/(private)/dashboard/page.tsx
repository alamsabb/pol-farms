import { getFarms, getBatches, getSales } from "@/lib/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { StatsCard } from "@/shared/components/ui/stats-card";
import ActiveBatches from "@/features/dashboard/components/active-batches";
import {
  formatCurrency,
  calculateFCR,
  calculateMortalityRate,
  formatPercent,
} from "@/shared/utils";
import {
  Building2,
  Egg,
  TrendingUp,
  AlertTriangle,
  Activity,
  IndianRupee,
  Target,
} from "lucide-react";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [farms, batches, sales] = await Promise.all([
    getFarms(),
    getBatches(),
    getSales(),
  ]);

  const activeBatches = batches.filter((batch) => batch.status === "active");
  const totalActiveBirds = activeBatches.reduce(
    (sum, batch) => sum + batch.currentBirdCount,
    0
  );
  const totalMortality = batches.reduce(
    (sum, batch) => sum + batch.totalMortality,
    0
  );
  const totalInitialBirds = batches.reduce(
    (sum, batch) => sum + batch.initialChickCount,
    0
  );
  const overallMortalityRate = calculateMortalityRate(
    totalMortality,
    totalInitialBirds
  );

  const totalFeedConsumed = batches.reduce(
    (sum, batch) => sum + batch.totalFeedConsumed,
    0
  );
  const totalWeightSold = batches.reduce(
    (sum, batch) => sum + batch.totalWeightSold,
    0
  );
  const averageFCR = calculateFCR(totalFeedConsumed, totalWeightSold);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalExpenditure = batches.reduce(
    (sum, batch) => sum + batch.initialChickCount * batch.costPerChick,
    0
  );

  // Calculate individual farm FCR
  const farmMetrics = farms.map((farm) => {
    const farmBatches = batches.filter((batch) => batch.farmId === farm._id);
    const farmFeedConsumed = farmBatches.reduce(
      (sum, batch) => sum + batch.totalFeedConsumed,
      0
    );
    const farmWeightSold = farmBatches.reduce(
      (sum, batch) => sum + batch.totalWeightSold,
      0
    );
    const farmFCR = calculateFCR(farmFeedConsumed, farmWeightSold);
    const farmActiveBirds = farmBatches
      .filter((batch) => batch.status === "active")
      .reduce((sum, batch) => sum + batch.currentBirdCount, 0);

    return {
      ...farm,
      fcr: farmFCR,
      activeBirds: farmActiveBirds,
      totalBatches: farmBatches.length,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium">
          Overview of your poultry farm operations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Active Birds"
          value={totalActiveBirds.toLocaleString("en-IN")}
          icon={Egg}
          iconColor="from-blue-500 to-blue-600"
          change={{ value: 12, type: "increase" }}
        />

        <StatsCard
          title="Total Farms"
          value={farms.length}
          icon={Building2}
          iconColor="from-green-500 to-green-600"
        />

        <StatsCard
          title="Mortality Rate"
          value={formatPercent(overallMortalityRate)}
          icon={AlertTriangle}
          iconColor="from-red-500 to-red-600"
          change={{ value: 2.3, type: "decrease" }}
        />

        <StatsCard
          title="Average FCR"
          value={averageFCR}
          icon={Activity}
          iconColor="from-purple-500 to-purple-600"
          change={{ value: 5.2, type: "increase" }}
        />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={IndianRupee}
          iconColor="from-emerald-500 to-emerald-600"
          change={{ value: 18.5, type: "increase" }}
        />

        <StatsCard
          title="Total Expenditure"
          value={formatCurrency(totalExpenditure)}
          icon={Target}
          iconColor="from-orange-500 to-red-600"
          change={{ value: 8.2, type: "increase" }}
        />

        <StatsCard
          title="Net Profit"
          value={formatCurrency(totalRevenue - totalExpenditure)}
          icon={TrendingUp}
          iconColor="from-green-500 to-emerald-600"
          change={{ value: 25.3, type: "increase" }}
        />
      </div>

      {/* Individual Farm Tracking */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>Individual Farm Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {farmMetrics.map((farm) => (
              <div
                key={farm._id}
                className="group relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-10 translate-x-10" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base sm:text-lg text-slate-800">
                      {farm.name}
                    </h3>
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-4 font-medium">
                    {farm.location}
                  </p>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-slate-600">
                        Active Birds:
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {farm.activeBirds.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-slate-600">
                        Total Batches:
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {farm.totalBatches}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-slate-600">
                        Farm FCR:
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {farm.fcr || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-slate-600">
                        Capacity:
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {farm.capacity.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Batches */}
      <ActiveBatches activeBatches={activeBatches} farms={farms} />
    </div>
  );
}
