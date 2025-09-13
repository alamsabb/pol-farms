import FarmForm from '@/features/farms/components/farm-form'
import FarmList from '@/features/farms/components/farm-list'
import { getFarms } from '@/features/farms/services/farm.service'
import { PageHeader } from '@/shared/components/layout/page-header'
import { Building2, Plus } from 'lucide-react'

export default async function FarmsPage() {
  const farms = await getFarms()

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <PageHeader 
        title="Farm Management" 
        description="Manage your poultry farms and track their performance"
        icon={Building2}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <FarmForm />
        </div>
        <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <FarmList farms={farms} />
        </div>
      </div>
    </div>
  )
}