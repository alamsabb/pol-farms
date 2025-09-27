import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Vendor } from '@/types'

interface VendorState {
  vendors: Vendor[]
  loading: boolean
  error: string | null
}

const initialState: VendorState = {
  vendors: [],
  loading: false,
  error: null,
}

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.vendors = action.payload
      state.loading = false
      state.error = null
    },
    addVendor: (state, action: PayloadAction<Vendor>) => {
      state.vendors.push(action.payload)
    },
    removeVendor: (state, action: PayloadAction<string>) => {
      state.vendors = state.vendors.filter(vendor => vendor._id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setVendors, addVendor, removeVendor, setLoading, setError } = vendorSlice.actions
export default vendorSlice.reducer