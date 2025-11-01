import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency, formatPercent } from "@/shared/utils";
import { Bird, Building2, TrendingUp, DollarSign } from "lucide-react";

interface MetricsCardsProps {
  totalActiveBirds: number;
  totalFarms: number;
  mortalityRate: number;
  totalRevenue: number;
}

const metrics = [
  {
    title: "Total Active Birds",
    icon: Bird,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    title: "Total Farms",
    icon: Building2,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    title: "Mortality Rate",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
  },
  {
    title: "Total Revenue",
    icon: DollarSign,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
];

export default function MetricsCards({
  totalActiveBirds,
  totalFarms,
  mortalityRate,
  totalRevenue,
}: MetricsCardsProps) {
  const values = [
    totalActiveBirds.toLocaleString(),
    totalFarms,
    formatPercent(mortalityRate),
    formatCurrency(totalRevenue),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.title}
            className={`animate-slide-up bg-gradient-to-br ${metric.bgGradient} hover:scale-105`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${metric.gradient}`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {values[index]}
              </div>
              <div className="flex items-center mt-2">
                <div
                  className={`h-1 w-full rounded-full bg-gradient-to-r ${metric.gradient} opacity-20`}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
