import { configureStore } from '@reduxjs/toolkit'
import farmSlice from './slices/farmSlice'
import batchSlice from './slices/batchSlice'
import vendorSlice from './slices/vendorSlice'
import saleSlice from './slices/saleSlice'

export const store = configureStore({
  reducer: {
    farms: farmSlice,
    batches: batchSlice,
    vendors: vendorSlice,
    sales: saleSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch