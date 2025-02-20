import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _createCustomer,
  _deleteCustomer,
  _editCustomer,
  _getCustomer,
  _getCustomers,
} from '../../services/customers.service'

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, { rejectWithValue }) => {
  try {
    return await _getCustomers()
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching customers')
  }
})

export const fetchCustomer = createAsyncThunk(
  'customers/fetchCustomer',
  async (id, { rejectWithValue }) => {
    try {
      return await _getCustomer(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching customer')
    }
  }
)

export const addCustomer = createAsyncThunk('customers/addCustomer', async (data, { rejectWithValue }) => {
  try {
    const response = await _createCustomer(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error creating customer')
  }
})

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    return await _editCustomer(id, updatedData)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating customer')
  }
})

export const removeCustomer = createAsyncThunk('customers/removeCustomer', async (id, { rejectWithValue }) => {
  try {
    await _deleteCustomer(id)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error deleting customer')
  }
})

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetApi: (state) => {
      state.data = []
      state.isLoading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.data
      })
  },
})

export const {
  resetApi,
} = customersSlice.actions
export default customersSlice.reducer
