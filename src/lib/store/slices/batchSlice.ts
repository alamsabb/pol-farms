import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Batch } from '@/types'

interface BatchState {
  batches: Batch[]
  loading: boolean
  error: string | null
}

const initialState: BatchState = {
  batches: [],
  loading: false,
  error: null,
}

const batchSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {
    setBatches: (state, action: PayloadAction<Batch[]>) => {
      state.batches = action.payload
      state.loading = false
      state.error = null
    },
    addBatch: (state, action: PayloadAction<Batch>) => {
      state.batches.push(action.payload)
    },
    updateBatch: (state, action: PayloadAction<Batch>) => {
      const index = state.batches.findIndex(batch => batch._id === action.payload._id)
      if (index !== -1) {
        state.batches[index] = action.payload
      }
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

export const { setBatches, addBatch, updateBatch, setLoading, setError } = batchSlice.actions
export default batchSlice.reducer