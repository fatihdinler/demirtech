import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _getLocationsByUserId,
  _getReportsForLocations,
} from '../../services/locations.service'

export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await _getLocationsByUserId()
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching locations')
    }
  }
)

export const fetchLocationReports = createAsyncThunk(
  'locations/fetchLocationReports',
  async ({ locationIds, startTime, endTime }, { rejectWithValue }) => {
    try {
      const res = await _getReportsForLocations({ locationIds, startTime, endTime })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching location reports')
    }
  }
)

const locationsSlice = createSlice({
  name: 'locations',
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
  extraReducers: builder => {
    builder
      .addCase(fetchLocations.pending, state => {
        state.isLoading = true; state.error = null
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.hasFetched = true
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || action.payload
        state.hasFetched = true
      })

      .addCase(fetchLocationReports.pending, state => {
        state.isReportLoading = true; state.error = null
      })
      .addCase(fetchLocationReports.fulfilled, (state, action) => {
        state.isReportLoading = false
        state.reportValues = action.payload
      })
      .addCase(fetchLocationReports.rejected, (state, action) => {
        state.isReportLoading = false
        state.error = action.payload?.message || action.payload
      })
  }
})

export const { resetApi } = locationsSlice.actions
export default locationsSlice.reducer
