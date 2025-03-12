import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _createBranch,
  _deleteBranch,
  _editBranch,
  _getBranch,
  _getBranches,
} from '../../services/branches.service'

export const fetchBranches = createAsyncThunk('branches/fetchBranches', async (_, { rejectWithValue }) => {
  try {
    return await _getBranches()
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching branches')
  }
})

export const fetchBranch = createAsyncThunk(
  'branches/fetchBranch',
  async (id, { rejectWithValue }) => {
    try {
      return await _getBranch(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching branch')
    }
  }
)

export const addBranch = createAsyncThunk('branches/addBranch', async (data, { rejectWithValue }) => {
  try {
    const response = await _createBranch(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error creating branch')
  }
})

export const updateBranch = createAsyncThunk('branches/updateBranch', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    return await _editBranch(id, updatedData)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating branch')
  }
})

export const removeBranch = createAsyncThunk('branches/removeBranch', async (id, { rejectWithValue }) => {
  try {
    return await _deleteBranch(id)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error deleting branch')
  }
})

const branchesSlice = createSlice({
  name: 'branches',
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
      .addCase(fetchBranches.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.hasFetched = true
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.data
        state.hasFetched = true
      })
  },
})


export const {
  resetApi,
} = branchesSlice.actions
export default branchesSlice.reducer
