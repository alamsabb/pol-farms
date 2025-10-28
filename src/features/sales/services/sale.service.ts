'use server'

import { revalidatePath } from 'next/cache'
import clientPromise, { getDb } from '@/lib/mongodb'
import { Sale } from '@/types'
import { saleSchema } from '@/shared/schemas'
import { ObjectId } from 'mongodb'

export async function createSale(formData: FormData) {
  const db = await getDb()
  
  const rawData = {
    batchId: formData.get('batchId') as string,
    vendorId: formData.get('vendorId') as string,
    saleDate: formData.get('saleDate') as string,
    birdsSold: parseInt(formData.get('birdsSold') as string),
    totalWeight: parseFloat(formData.get('totalWeight') as string),
    pricePerKg: parseFloat(formData.get('pricePerKg') as string),
    paymentStatus: formData.get('paymentStatus') as 'paid' | 'pending' | 'partial',
  }

  const validatedData = saleSchema.parse(rawData)
  
  const sale: Omit<Sale, '_id'> = {
    ...validatedData,
    date: new Date(validatedData.saleDate),
    totalAmount: validatedData.totalWeight * validatedData.pricePerKg,
    createdAt: new Date(),
  }

  await db.collection('sales').insertOne(sale)
  
  await db.collection('batches').updateOne(
    { _id: new ObjectId(validatedData.batchId) },
    { $inc: { currentBirdCount: -validatedData.birdsSold } }
  )
  
  revalidatePath('/sales')
}

export async function getSales(): Promise<Sale[]> {
  const db = await getDb()
  
  const sales = await db.collection('sales').aggregate([
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendorId',
        foreignField: '_id',
        as: 'vendor'
      }
    },
    {
      $addFields: {
        vendorName: { $arrayElemAt: ['$vendor.name', 0] }
      }
    }
  ]).toArray()
  
  return sales.map(sale => ({
    ...sale,
    _id: sale._id.toString(),
    batchId: sale.batchId.toString(),
    vendorId: sale.vendorId.toString(),
  })) as Sale[]
}