export interface Farm {
  _id?: string
  name: string
  location: string
  capacity: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Batch {
  _id?: string
  farmId: string
  farmName?: string
  startDate: Date
  initialChickCount: number
  currentBirdCount: number
  breed: string
  supplier: string
  costPerChick: number
  status: 'active' | 'completed' | 'sold'
  totalMortality: number
  totalFeedConsumed: number
  totalWeightSold: number
  totalBirdsSold: number
  totalProductionCost?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface DailyRecord {
  _id?: string
  batchId: string
  date: Date
  feedBags: number
  feedCost: number
  mortality: number
  medicineUsed?: string
  medicineCost?: number
  averageWeight?: number
  notes?: string
  createdAt?: Date
}

export interface Vendor {
  _id?: string
  name: string
  company: string
  contact: string
  address: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Sale {
  _id?: string
  batchId: string
  vendorId: string
  batchName?: string
  vendorName?: string
  date: Date
  birdsSold: number
  totalWeight: number
  pricePerKg: number
  totalAmount: number
  createdAt?: Date
}

export interface KPI {
  mortalityRate: number
  fcr: number
  averageBirdWeight: number
  livabilityRate: number
}

export interface DashboardMetrics {
  totalActiveBirds: number
  totalFarms: number
  overallMortalityRate: number
  averageFCR: number
  totalRevenue: number
  totalExpenditure: number
  activeBatches: Batch[]
}