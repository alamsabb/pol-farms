import { z } from 'zod'

export const farmSchema = z.object({
  name: z.string().min(1, 'Farm name is required').max(100, 'Farm name too long'),
  location: z.string().min(1, 'Location is required').max(200, 'Location too long'),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(1000000, 'Capacity too large')
})

export const batchSchema = z.object({
  farmId: z.string().min(1, 'Farm selection is required'),
  startDate: z.string().min(1, 'Start date is required').refine((date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    // Allow any time on the current date
    today.setHours(23, 59, 59, 999)
    return selectedDate <= today
  }, 'Start date cannot be in the future'),
  initialChickCount: z.number().min(1, 'Initial chick count must be at least 1').max(100000, 'Count too large'),
  breed: z.string().min(1, 'Breed is required').max(100, 'Breed name too long'),
  supplier: z.string().min(1, 'Supplier is required').max(100, 'Supplier name too long'),
  costPerChick: z.number().min(0.01, 'Cost per chick must be greater than 0').max(1000, 'Cost too high')
})

export const vendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required').max(100, 'Name too long'),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  contact: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number too long'),
  address: z.string().min(1, 'Address is required').max(300, 'Address too long')
})

export const saleSchema = z.object({
  batchId: z.string().min(1, 'Batch selection is required'),
  vendorId: z.string().min(1, 'Vendor selection is required'),
  date: z.string().min(1, 'Sale date is required').refine((date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return selectedDate <= today
  }, 'Sale date cannot be in the future'),
  birdsSold: z.number().min(1, 'Birds sold must be at least 1').max(100000, 'Count too large'),
  totalWeight: z.number().min(0.1, 'Total weight must be greater than 0').max(100000, 'Weight too large'),
  pricePerKg: z.number().min(0.01, 'Price per kg must be greater than 0').max(10000, 'Price too high')
})

export const dailyRecordSchema = z.object({
  batchId: z.string().min(1, 'Batch selection is required'),
  date: z.string().min(1, 'Date is required').refine((date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return selectedDate <= today
  }, 'Date cannot be in the future'),
  feedKg: z.number().min(0, 'Feed (kg) cannot be negative').max(100000, 'Too much feed'),
  feedCost: z.number().min(0, 'Feed cost cannot be negative').max(100000, 'Feed cost too high'),
  mortality: z.number().min(0, 'Mortality cannot be negative').max(10000, 'Mortality count too high'),
  medicineUsed: z.string().max(200, 'Medicine name too long').optional(),
  medicineCost: z.number().min(0, 'Medicine cost cannot be negative').max(50000, 'Medicine cost too high').optional(),
  averageWeight: z.number().min(0, 'Weight cannot be negative').max(10, 'Weight too high').optional(),
  notes: z.string().max(500, 'Notes too long').optional()
})

export type FarmFormData = z.infer<typeof farmSchema>
export type BatchFormData = z.infer<typeof batchSchema>
export type VendorFormData = z.infer<typeof vendorSchema>
export type SaleFormData = z.infer<typeof saleSchema>
export type DailyRecordFormData = z.infer<typeof dailyRecordSchema>