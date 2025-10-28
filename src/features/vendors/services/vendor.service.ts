'use server'

import { revalidatePath } from 'next/cache'
import clientPromise, { getDb } from '@/lib/mongodb'
import { Vendor } from '@/types'
import { vendorSchema } from '@/shared/schemas'
import { ObjectId } from 'mongodb'

export async function createVendor(formData: FormData) {
  const db = await getDb()
  
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
  const db = await getDb()
  
  const vendors = await db.collection('vendors').find({}).toArray()
  return vendors.map(vendor => ({
    ...vendor,
    _id: vendor._id.toString(),
  })) as Vendor[]
}

export async function deleteVendor(id: string) {
  const db = await getDb()
  
  await db.collection('vendors').deleteOne({ _id: new ObjectId(id) })
  revalidatePath('/vendors')
}