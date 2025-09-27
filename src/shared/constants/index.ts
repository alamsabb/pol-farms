export const FEED_BAG_WEIGHT = 50 // kg per bag

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  PARTIAL: 'partial'
} as const

export const BATCH_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager'
} as const

export const ROUTES = {
  DASHBOARD: '/dashboard',
  FARMS: '/farms',
  BATCHES: '/batches',
  VENDORS: '/vendors',
  SALES: '/sales',
  LOGIN: '/login'
} as const