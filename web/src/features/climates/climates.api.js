import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _createClimate,
  _deleteClimate,
  _editClimate,
  _getClimate,
  _getClimates,
  _getClimateModelNames,
} from '../../services/climates.service'

export const fetchClimates = createAsyncThunk('climates/fetchClimates', async (_, { rejectWithValue }) => {
  try {
    return await _getClimates()
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching climates')
  }
})

export const fetchClimate = createAsyncThunk(
  'climates/fetchClimate',
  async (id, { rejectWithValue }) => {
    try {
      return await _getClimate(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching climate')
    }
  }
)

export const addClimate = createAsyncThunk('climates/addClimate', async (data, { rejectWithValue }) => {
  try {
    const response = await _createClimate(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error creating climate')
  }
})

export const updateClimate = createAsyncThunk('climates/updateClimate', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    return await _editClimate(id, updatedData)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating climate')
  }
})

export const removeClimate = createAsyncThunk('climates/removeClimate', async (id, { rejectWithValue }) => {
  try {
    return await _deleteClimate(id)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error deleting climate')
  }
})

const climatesSlice = createSlice({
  name: 'climates',
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
      .addCase(fetchClimates.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClimates.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.hasFetched = true
      })
      .addCase(fetchClimates.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.data
        state.hasFetched = true
      })
  },
})


export const {
  resetApi,
} = climatesSlice.actions
export default climatesSlice.reducer
