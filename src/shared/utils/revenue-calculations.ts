import { Batch, Sale, DailyRecord } from '@/types';

export interface RevenueMetrics {
  totalRevenue: number;
  averagePricePerKg: number;
  averagePricePerBird: number;
  totalWeightSold: number;
  totalBirdsSold: number;
  totalChickCost: number;
  totalFeedCost: number;
  totalMedicineCost: number;
  totalOperatingCost: number;
  totalCost: number;
  netProfit: number;
  roi: number;
  mortalityRate: number;
  fcr: number;
  averageWeight: number;
  daysToMarket: number;
}

export function calculateRevenueMetrics(
  batch: Batch,
  sales: Sale[],
  dailyRecords: DailyRecord[]
): RevenueMetrics {
  const batchSales = sales.filter(sale => sale.batchId === batch._id);
  
  // Revenue calculations
  const totalRevenue = batchSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const totalWeightSold = batchSales.reduce((sum, sale) => sum + (sale.totalWeight || 0), 0);
  const totalBirdsSold = batchSales.reduce((sum, sale) => sum + (sale.birdsSold || 0), 0);
  
  const averagePricePerKg = totalWeightSold > 0 ? totalRevenue / totalWeightSold : 0;
  const averagePricePerBird = totalBirdsSold > 0 ? totalRevenue / totalBirdsSold : 0;

  // Cost calculations
  const totalChickCost = batch.initialChickCount * batch.costPerChick;
  const totalFeedCost = dailyRecords.reduce((sum, record) => sum + (record.feedCost || 0), 0);
  const totalMedicineCost = dailyRecords.reduce((sum, record) => sum + (record.medicineCost || 0), 0);
  const totalOperatingCost = totalFeedCost + totalMedicineCost;
  const totalCost = totalChickCost + totalOperatingCost;

  // Profit/Loss calculations
  const netProfit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  // Performance metrics
  const mortalityRate = batch.initialChickCount > 0 
    ? (batch.totalMortality / batch.initialChickCount) * 100 
    : 0;
  
  const fcr = totalWeightSold > 0 
    ? (batch.totalFeedConsumed || 0) / totalWeightSold 
    : 0;

  const averageWeight = totalBirdsSold > 0 
    ? totalWeightSold / totalBirdsSold 
    : 0;

  const daysToMarket = batch.startDate 
    ? Math.ceil((new Date().getTime() - new Date(batch.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    totalRevenue,
    averagePricePerKg,
    averagePricePerBird,
    totalWeightSold,
    totalBirdsSold,
    totalChickCost,
    totalFeedCost,
    totalMedicineCost,
    totalOperatingCost,
    totalCost,
    netProfit,
    roi,
    mortalityRate,
    fcr,
    averageWeight,
    daysToMarket,
  };
}

export function formatROI(roi: number): string {
  return `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`;
}

export function formatProfit(profit: number): string {
  const sign = profit >= 0 ? '+' : '';
  return `${sign}₹${Math.abs(profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export function getProfitColor(profit: number): string {
  if (profit > 0) return 'text-green-600';
  if (profit < 0) return 'text-red-600';
  return 'text-slate-600';
}

export function getROIColor(roi: number): string {
  if (roi > 0) return 'text-green-600';
  if (roi < 0) return 'text-red-600';
  return 'text-slate-600';
}
