import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _getDevicesByUserId
} from '../../services/devices.service'

export const fetchDevices = createAsyncThunk(
  'devices/fetchDevice',
  async (id, { rejectWithValue }) => {
    try {
      return await _getDevicesByUserId()
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching device')
    }
  }
)

const devicesSlice = createSlice({
  name: 'devices',
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    resetApi: (state) => {
      state.data = []
      state.isLoading = false
      state.error = null
      state.hasFetched = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.hasFetched = true
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.data
        state.hasFetched = true
      })
  },
})

export const {
  resetApi,
} = devicesSlice.actions
export default devicesSlice.reducer
