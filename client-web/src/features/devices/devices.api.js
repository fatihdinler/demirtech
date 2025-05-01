import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _getDevicesByUserId,
  _getReportsForDevices,
} from '../../services/devices.service'

export const fetchDevices = createAsyncThunk(
  'devices/fetchDevice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await _getDevicesByUserId()
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching device')
    }
  }
)

export const fetchDeviceReports = createAsyncThunk(
  'devices/fetchDeviceReports',
  async ({ deviceIds, startTime, endTime }, { rejectWithValue }) => {
    try {
      const response = await _getReportsForDevices({ deviceIds, startTime, endTime })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching device reports')
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
    reportValues: [],
    isReportLoading: false,
  },
  reducers: {
    resetApi: (state) => {
      state.data = []
      state.isLoading = false
      state.error = null
      state.hasFetched = false
      state.reportValues = []
      state.isReportLoading = false
    },
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
        state.error = action.payload?.message || action.payload
        state.hasFetched = true
      })

      .addCase(fetchDeviceReports.pending, (state) => {
        state.isReportLoading = true
        state.error = null
      })
      .addCase(fetchDeviceReports.fulfilled, (state, action) => {
        state.isReportLoading = false
        state.reportValues = action.payload
        state.hasFetched = true
      })
      .addCase(fetchDeviceReports.rejected, (state, action) => {
        state.isReportLoading = false
        state.error = action.payload?.message || action.payload
        state.hasFetched = true
      })
  },
})

export const { resetApi } = devicesSlice.actions
export default devicesSlice.reducer
