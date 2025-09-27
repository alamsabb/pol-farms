import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Sale } from '@/types'

interface SaleState {
  sales: Sale[]
  loading: boolean
  error: string | null
}

const initialState: SaleState = {
  sales: [],
  loading: false,
  error: null,
}

const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSales: (state, action: PayloadAction<Sale[]>) => {
      state.sales = action.payload
      state.loading = false
      state.error = null
    },
    addSale: (state, action: PayloadAction<Sale>) => {
      state.sales.push(action.payload)
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

export const { setSales, addSale, setLoading, setError } = saleSlice.actions
export default saleSlice.reducer