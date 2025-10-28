'use server'

import { revalidatePath } from 'next/cache'
import clientPromise, { getDb } from '@/lib/mongodb'
import { Farm, Batch, Vendor, Sale, DailyRecord } from '@/types'
import { ObjectId } from 'mongodb'

// Farm Actions
export async function createFarm(formData: FormData) {
  try {
    const db = await getDb()
    
    const farm: Omit<Farm, '_id'> = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      capacity: parseInt(formData.get('capacity') as string),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection('farms').insertOne(farm)
    revalidatePath('/farms')
    
    return { success: true }
  } catch (error) {
    console.error('Error creating farm:', error)
    return { success: false, error: 'Failed to create farm' }
  }
}

export async function getFarms(): Promise<Farm[]> {
  try {
    const db = await getDb()
    
    const farms = await db.collection('farms').find({}).toArray()
    return farms.map(farm => ({
      ...farm,
      _id: farm._id.toString(),
    })) as Farm[]
  } catch (error) {
    console.error('Error fetching farms:', error)
    return []
  }
}

export async function deleteFarm(farmId: string) {
  try {
    const db = await getDb()
    
    await db.collection('farms').deleteOne({ _id: new ObjectId(farmId) })
    revalidatePath('/farms')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting farm:', error)
    return { success: false, error: 'Failed to delete farm' }
  }
}

// Farm Update
export async function updateFarm(formData: FormData) {
  try {
    const db = await getDb()
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const location = formData.get('location') as string
    const capacity = parseInt(formData.get('capacity') as string)

    await db.collection('farms').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          location,
          capacity,
          updatedAt: new Date(),
        },
      }
    )

    revalidatePath('/farms')
    return { success: true }
  } catch (error) {
    console.error('Error updating farm:', error)
    return { success: false, error: 'Failed to update farm' }
  }
}

// Batch Actions
export async function createBatch(formData: FormData) {
  try {
    const db = await getDb()
    
    const batch: Omit<Batch, '_id'> = {
      farmId: formData.get('farmId') as string,
      startDate: new Date(formData.get('startDate') as string),
      initialChickCount: parseInt(formData.get('initialChickCount') as string),
      currentBirdCount: parseInt(formData.get('initialChickCount') as string),
      breed: formData.get('breed') as string,
      supplier: formData.get('supplier') as string,
      costPerChick: parseFloat(formData.get('costPerChick') as string),
      status: 'active',
      totalMortality: 0,
      totalFeedConsumed: 0,
      totalWeightSold: 0,
      totalBirdsSold: 0,
      // Initialize revenue fields
      totalRevenue: 0,
      averagePricePerKg: 0,
      averagePricePerBird: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      roi: 0,
      totalFeedCost: 0,
      totalMedicineCost: 0,
      totalChickCost: parseInt(formData.get('initialChickCount') as string) * parseFloat(formData.get('costPerChick') as string),
      totalOperatingCost: 0,
      mortalityRate: 0,
      fcr: 0,
      averageWeight: 0,
      daysToMarket: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection('batches').insertOne(batch)
    revalidatePath('/batches')
    
    return { success: true }
  } catch (error) {
    console.error('Error creating batch:', error)
    return { success: false, error: 'Failed to create batch' }
  }
}

export async function getBatches(): Promise<Batch[]> {
  try {
    const db = await getDb()
    
    const batches = await db.collection('batches').find({}).toArray()
    return batches.map(batch => ({
      ...batch,
      _id: batch._id.toString(),
      startDate: new Date(batch.startDate),
    })) as Batch[]
  } catch (error) {
    console.error('Error fetching batches:', error)
    return []
  }
}

export async function updateBatchRevenueMetrics(batchId: string) {
  try {
    const db = await getDb()
    
    // Get batch data
    const batch = await db.collection('batches').findOne({ _id: new ObjectId(batchId) })
    if (!batch) return { success: false, error: 'Batch not found' }

    // Get related sales and daily records
    const sales = await db.collection('sales').find({ batchId }).toArray()
    const dailyRecords = await db.collection('dailyRecords').find({ batchId }).toArray()

    // Calculate revenue metrics
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const totalWeightSold = sales.reduce((sum, sale) => sum + sale.totalWeight, 0)
    const totalBirdsSold = sales.reduce((sum, sale) => sum + sale.birdsSold, 0)
    
    const averagePricePerKg = totalWeightSold > 0 ? totalRevenue / totalWeightSold : 0
    const averagePricePerBird = totalBirdsSold > 0 ? totalRevenue / totalBirdsSold : 0
    
    const totalChickCost = batch.initialChickCount * batch.costPerChick
    const totalFeedCost = dailyRecords.reduce((sum, record) => sum + (record.feedCost || 0), 0)
    const totalMedicineCost = dailyRecords.reduce((sum, record) => sum + (record.medicineCost || 0), 0)
    const totalOperatingCost = totalFeedCost + totalMedicineCost
    const totalCost = totalChickCost + totalOperatingCost
    
    const netProfit = totalRevenue - totalCost
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0
    
    const mortalityRate = batch.initialChickCount > 0 
      ? (batch.totalMortality / batch.initialChickCount) * 100 
      : 0
    
    const fcr = totalWeightSold > 0 ? batch.totalFeedConsumed / totalWeightSold : 0
    const averageWeight = totalBirdsSold > 0 ? totalWeightSold / totalBirdsSold : 0
    
    const daysToMarket = batch.startDate 
      ? Math.ceil((new Date().getTime() - new Date(batch.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Update batch with calculated metrics
    await db.collection('batches').updateOne(
      { _id: new ObjectId(batchId) },
      {
        $set: {
          totalRevenue,
          averagePricePerKg,
          averagePricePerBird,
          totalProfit: netProfit > 0 ? netProfit : 0,
          totalLoss: netProfit < 0 ? Math.abs(netProfit) : 0,
          netProfit,
          roi,
          totalFeedCost,
          totalMedicineCost,
          totalChickCost,
          totalOperatingCost,
          mortalityRate,
          fcr,
          averageWeight,
          daysToMarket,
          totalWeightSold,
          totalBirdsSold,
          updatedAt: new Date(),
        },
      }
    )

    revalidatePath('/batches')
    revalidatePath(`/batches/${batchId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error updating batch revenue metrics:', error)
    return { success: false, error: 'Failed to update batch revenue metrics' }
  }
}

// Vendor Actions
export async function createVendor(formData: FormData) {
  try {
    const db = await getDb()
    
    const vendor: Omit<Vendor, '_id'> = {
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      contact: formData.get('contact') as string,
      address: formData.get('address') as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection('vendors').insertOne(vendor)
    revalidatePath('/vendors')
    
    return { success: true }
  } catch (error) {
    console.error('Error creating vendor:', error)
    return { success: false, error: 'Failed to create vendor' }
  }
}

export async function getVendors(): Promise<Vendor[]> {
  try {
    const db = await getDb()
    
    const vendors = await db.collection('vendors').find({}).toArray()
    return vendors.map(vendor => ({
      ...vendor,
      _id: vendor._id.toString(),
    })) as Vendor[]
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return []
  }
}

export async function updateVendor(formData: FormData) {
  try {
    const db = await getDb()
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const company = formData.get('company') as string
    const contact = formData.get('contact') as string
    const address = formData.get('address') as string

    await db.collection('vendors').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          company,
          contact,
          address,
          updatedAt: new Date(),
        },
      }
    )

    revalidatePath('/vendors')
    return { success: true }
  } catch (error) {
    console.error('Error updating vendor:', error)
    return { success: false, error: 'Failed to update vendor' }
  }
}

export async function deleteVendor(vendorId: string) {
  try {
    const db = await getDb()
    
    await db.collection('vendors').deleteOne({ _id: new ObjectId(vendorId) })
    revalidatePath('/vendors')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return { success: false, error: 'Failed to delete vendor' }
  }
}

// Sale Actions
export async function createSale(formData: FormData) {
  try {
    const db = await getDb()
    
    const batchId = formData.get('batchId') as string
    const birdsSold = parseInt(formData.get('birdsSold') as string)
    const totalWeight = parseFloat(formData.get('totalWeight') as string)
    const pricePerKg = parseFloat(formData.get('pricePerKg') as string)
    
    // Validate batch exists and has enough birds
    const batch = await db.collection('batches').findOne({ _id: new ObjectId(batchId) })
    if (!batch) {
      return { success: false, error: 'Batch not found' }
    }
    
    if (batch.status !== 'active') {
      return { success: false, error: 'Cannot sell from inactive batch' }
    }
    
    if (batch.currentBirdCount < birdsSold) {
      return { success: false, error: `Only ${batch.currentBirdCount} birds available in this batch` }
    }
    
    const sale: Omit<Sale, '_id'> = {
      batchId,
      vendorId: formData.get('vendorId') as string,
      date: new Date(formData.get('date') as string),
      birdsSold,
      totalWeight,
      pricePerKg,
      totalAmount: totalWeight * pricePerKg,
      createdAt: new Date(),
    }

    await db.collection('sales').insertOne(sale)
    
    const newBirdCount = batch.currentBirdCount - birdsSold
    
    // Update batch and set status to completed if no birds left
    await db.collection('batches').updateOne(
      { _id: new ObjectId(batchId) },
      { 
        $inc: { 
          currentBirdCount: -birdsSold,
          totalBirdsSold: birdsSold,
          totalWeightSold: totalWeight
        },
        $set: { 
          updatedAt: new Date(),
          status: newBirdCount === 0 ? 'completed' : 'active'
        }
      }
    )
    
    revalidatePath('/sales')
    revalidatePath('/batches')
    
    // Update batch revenue metrics
    await updateBatchRevenueMetrics(batchId)
    
    return { success: true }
  } catch (error) {
    console.error('Error creating sale:', error)
    return { success: false, error: 'Failed to create sale' }
  }
}

export async function getSales(): Promise<Sale[]> {
  try {
    const db = await getDb()
    
    const sales = await db.collection('sales').find({}).sort({ createdAt: -1 }).toArray()
    return sales.map(sale => ({
      ...sale,
      _id: sale._id.toString(),
      date: new Date(sale.date),
    })) as Sale[]
  } catch (error) {
    console.error('Error fetching sales:', error)
    return []
  }
}

// Daily Records - Query
export async function getDailyRecords(batchId?: string): Promise<DailyRecord[]> {
  try {
    const db = await getDb()
    const filter = batchId ? { batchId } : {}
    const records = await db.collection('dailyRecords').find(filter).sort({ date: -1 }).toArray()
    return records.map((r) => ({
      ...r,
      _id: r._id.toString(),
      date: new Date(r.date),
    })) as DailyRecord[]
  } catch (error) {
    console.error('Error fetching daily records:', error)
    return []
  }
}

// Daily Record Actions
export async function createDailyRecord(formData: FormData) {
  try {
    const db = await getDb()
    
    const batchId = formData.get('batchId') as string
    const mortality = parseInt(formData.get('mortality') as string) || 0
    const date = formData.get('date') as string
    
    // Check if record already exists for this date
    const existingRecord = await db.collection('dailyRecords').findOne({
      batchId,
      date: new Date(date)
    })
    
    if (existingRecord) {
      return { success: false, error: 'Daily record already exists for this date' }
    }
    
    // Validate batch exists and has enough birds for mortality
    const batch = await db.collection('batches').findOne({ _id: new ObjectId(batchId) })
    if (!batch) {
      return { success: false, error: 'Batch not found' }
    }
    
    if (batch.currentBirdCount < mortality) {
      return { success: false, error: `Only ${batch.currentBirdCount} birds available in this batch` }
    }
    
    const feedCost = parseFloat(formData.get('feedCost') as string) || 0
    const medicineCost = parseFloat(formData.get('medicineCost') as string) || 0
    
    const dailyRecord = {
      batchId,
      date: new Date(date),
      feedKg: parseFloat(formData.get('feedKg') as string) || 0,
      feedCost,
      mortality,
      medicineUsed: formData.get('medicineUsed') as string || '',
      medicineCost,
      averageWeight: parseFloat(formData.get('averageWeight') as string) || null,
      notes: formData.get('notes') as string || '',
      createdAt: new Date(),
    }

    await db.collection('dailyRecords').insertOne(dailyRecord)
    
    // Update batch with mortality and costs
    const totalDailyCost = feedCost + medicineCost
    
    if (mortality > 0) {
      const newBirdCount = batch.currentBirdCount - mortality
      await db.collection('batches').updateOne(
        { _id: new ObjectId(batchId) },
        { 
          $inc: { 
            currentBirdCount: -mortality,
            totalMortality: mortality,
            totalFeedConsumed: dailyRecord.feedKg,
            totalProductionCost: totalDailyCost
          },
          $set: { 
            updatedAt: new Date(),
            status: newBirdCount === 0 ? 'completed' : 'active'
          }
        }
      )
    } else {
      await db.collection('batches').updateOne(
        { _id: new ObjectId(batchId) },
        { 
          $inc: { 
            totalFeedConsumed: dailyRecord.feedKg,
            totalProductionCost: totalDailyCost
          },
          $set: { updatedAt: new Date() }
        }
      )
    }
    
    revalidatePath('/batches')
    
    // Update batch revenue metrics
    await updateBatchRevenueMetrics(batchId)
    
    return { success: true }
  } catch (error) {
    console.error('Error creating daily record:', error)
    return { success: false, error: 'Failed to create daily record' }
  }
}