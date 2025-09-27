import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Farm } from '@/types'

interface FarmState {
  farms: Farm[]
  loading: boolean
  error: string | null
}

const initialState: FarmState = {
  farms: [],
  loading: false,
  error: null,
}

const farmSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    setFarms: (state, action: PayloadAction<Farm[]>) => {
      state.farms = action.payload
      state.loading = false
      state.error = null
    },
    addFarm: (state, action: PayloadAction<Farm>) => {
      state.farms.push(action.payload)
    },
    removeFarm: (state, action: PayloadAction<string>) => {
      state.farms = state.farms.filter(farm => farm._id !== action.payload)
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

export const { setFarms, addFarm, removeFarm, setLoading, setError } = farmSlice.actions
export default farmSlice.reducer