'use client'

import { usePathname } from 'next/navigation'

export function usePageTitle() {
  const pathname = usePathname()
  
  if (pathname === '/dashboard') return { title: 'Dashboard', subtitle: 'Overview of your poultry operations' }
  if (pathname === '/farms') return { title: 'Farms', subtitle: 'Manage your farm locations' }
  if (pathname === '/batches') return { title: 'Batches', subtitle: 'Track your poultry batches' }
  if (pathname.startsWith('/batches/')) return { title: 'Batch Details', subtitle: 'View batch insights and records' }
  if (pathname === '/vendors') return { title: 'Vendors', subtitle: 'Manage customers and suppliers' }
  if (pathname === '/sales') return { title: 'Sales', subtitle: 'Track sales and revenue' }
  
  return { title: 'Poultry Farm', subtitle: 'Management System' }
}