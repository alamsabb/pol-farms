'use server'

import { revalidatePath } from 'next/cache'
import clientPromise from '@/lib/mongodb'
import { Vendor } from '@/types'
import { vendorSchema } from '@/shared/schemas'
import { ObjectId } from 'mongodb'

export async function createVendor(formData: FormData) {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  const rawData = {
    name: formData.get('name') as string,
    company: formData.get('company') as string,
    contact: formData.get('contact') as string,
    address: formData.get('address') as string,
  }

  const validatedData = vendorSchema.parse(rawData)
  
  const vendor: Omit<Vendor, '_id'> = {
    ...validatedData,
    createdAt: new Date(),
  }

  await db.collection('vendors').insertOne(vendor)
  revalidatePath('/vendors')
}

export async function getVendors(): Promise<Vendor[]> {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  const vendors = await db.collection('vendors').find({}).toArray()
  return vendors.map(vendor => ({
    ...vendor,
    _id: vendor._id.toString(),
  })) as Vendor[]
}

export async function deleteVendor(id: string) {
  const client = await clientPromise
  const db = client.db('poultry-farm')
  
  await db.collection('vendors').deleteOne({ _id: new ObjectId(id) })
  revalidatePath('/vendors')
}