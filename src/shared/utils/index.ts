import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function calculateFCR(feedConsumed: number, totalWeight: number): number {
  if (totalWeight === 0) return 0
  return Number((feedConsumed / totalWeight).toFixed(2))
}

export function calculateMortalityRate(mortality: number, initialCount: number): number {
  if (initialCount === 0) return 0
  return Number(((mortality / initialCount) * 100).toFixed(2))
}

export function formatPercent(value: number, digits: number = 2): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) return '0%'
  return `${value.toFixed(digits)}%`
}

export function calculateBatchAge(startDate: Date): number {
  // Calculate age in days, handling timezone issues properly
  const today = new Date();
  const start = new Date(startDate);
  
  // Set both dates to start of day to avoid timezone issues
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  
  return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}