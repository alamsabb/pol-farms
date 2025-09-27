import { BatchDetailsClient } from './batch-details-client'
import { Loader } from '@/shared/components/ui/loader'
import { Suspense } from 'react'

interface BatchDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function BatchDetailsPage({ params }: BatchDetailsPageProps) {
  const { id } = await params
  
  return (
    <Suspense fallback={<Loader text="Loading Batch Details" />}>
      <BatchDetailsClient batchId={id} />
    </Suspense>
  )
}