'use server'

import { revalidatePath } from 'next/cache'
import clientPromise from '@/lib/mongodb'
import { Batch, DailyRecord } from '@/types'
import { batchSchema, dailyRecordSchema } from '@/shared/schemas'
import { ObjectId } from 'mongodb'

export async function createBatch(formData: FormData) {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  const rawData = {
    farmId: formData.get('farmId') as string,
    startDate: formData.get('startDate') as string,
    initialChickCount: parseInt(formData.get('initialChickCount') as string),
    breed: formData.get('breed') as string,
    supplier: formData.get('supplier') as string,
    costPerChick: parseFloat(formData.get('costPerChick') as string),
  }

  const validatedData = batchSchema.parse(rawData)
  
  const batch: Omit<Batch, '_id'> = {
    ...validatedData,
    startDate: new Date(validatedData.startDate),
    currentBirdCount: validatedData.initialChickCount,
    totalMortality: 0,
    totalFeedConsumed: 0,
    status: 'active',
    createdAt: new Date(),
  }

  await db.collection('batches').insertOne(batch)
  revalidatePath('/batches')
}

export async function getBatches(): Promise<Batch[]> {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  const batches = await db.collection('batches').aggregate([
    {
      $lookup: {
        from: 'farms',
        localField: 'farmId',
        foreignField: '_id',
        as: 'farm'
      }
    },
    {
      $addFields: {
        farmName: { $arrayElemAt: ['$farm.name', 0] }
      }
    }
  ]).toArray()
  
  return batches.map(batch => ({
    ...batch,
    _id: batch._id.toString(),
    farmId: batch.farmId.toString(),
  })) as Batch[]
}

export async function addDailyRecord(formData: FormData) {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  const rawData = {
    batchId: formData.get('batchId') as string,
    feedBags: parseInt(formData.get('feedBags') as string),
    mortality: parseInt(formData.get('mortality') as string),
    averageWeight: formData.get('averageWeight') ? parseFloat(formData.get('averageWeight') as string) : undefined,
    notes: formData.get('notes') as string || undefined,
  }

  const validatedData = dailyRecordSchema.parse(rawData)
  const feedWeight = validatedData.feedBags * 50
  
  const record: Omit<DailyRecord, '_id'> = {
    ...validatedData,
    date: new Date(),
  }

  await db.collection('dailyRecords').insertOne(record)
  
  await db.collection('batches').updateOne(
    { _id: new ObjectId(validatedData.batchId) },
    {
      $inc: {
        totalMortality: validatedData.mortality,
        totalFeedConsumed: feedWeight,
        currentBirdCount: -validatedData.mortality
      }
    }
  )
  
  revalidatePath('/batches')
}