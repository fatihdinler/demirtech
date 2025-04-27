import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _getLocationsByUserId,
} from '../../services/locations.service'

export const fetchLocations = createAsyncThunk('locations/fetchLocations', async (_, { rejectWithValue }) => {
  try {
    return await _getLocationsByUserId()
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching locations')
  }
})

const locationsSlice = createSlice({
  name: 'locations',
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
      .addCase(fetchLocations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.hasFetched = true
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.data
        state.hasFetched = true
      })
  },
})


export const {
  resetApi,
} = locationsSlice.actions
export default locationsSlice.reducer
