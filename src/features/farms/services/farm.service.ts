'use server'

import { revalidatePath } from 'next/cache'
import clientPromise from '@/lib/mongodb'
import { Farm } from '@/types'
import { farmSchema } from '@/shared/schemas'
import { ObjectId } from 'mongodb'

export async function createFarm(formData: FormData) {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  const rawData = {
    name: formData.get('name') as string,
    location: formData.get('location') as string,
    capacity: parseInt(formData.get('capacity') as string),
  }

  const validatedData = farmSchema.parse(rawData)
  
  const farm: Omit<Farm, '_id'> = {
    ...validatedData,
    createdAt: new Date(),
  }

  await db.collection('farms').insertOne(farm)
  revalidatePath('/farms')
}

export async function getFarms(): Promise<Farm[]> {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  const farms = await db.collection('farms').find({}).toArray()
  return farms.map(farm => ({
    ...farm,
    _id: farm._id.toString(),
  })) as Farm[]
}

export async function deleteFarm(id: string) {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  await db.collection('farms').deleteOne({ _id: new ObjectId(id) })
  revalidatePath('/farms')
}