import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _createLocation,
  _deleteLocation,
  _editLocation,
  _getLocation,
  _getLocations,
} from '../../services/locations.service'

export const fetchLocations = createAsyncThunk('climates/fetchLocations', async (_, { rejectWithValue }) => {
  try {
    return await _getLocations()
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching climates')
  }
})

export const fetchLocation = createAsyncThunk(
  'climates/fetchLocation',
  async (id, { rejectWithValue }) => {
    try {
      return await _getLocation(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching location')
    }
  }
)

export const addLocation = createAsyncThunk('climates/addLocation', async (data, { rejectWithValue }) => {
  try {
    const response = await _createLocation(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error creating location')
  }
})

export const updateLocation = createAsyncThunk('climates/updateLocation', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    return await _editLocation(id, updatedData)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating location')
  }
})

export const removeLocation = createAsyncThunk('climates/removeLocation', async (id, { rejectWithValue }) => {
  try {
    return await _deleteLocation(id)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error deleting location')
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
