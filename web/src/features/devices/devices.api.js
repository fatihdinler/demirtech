import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createDevice,
  editDevice,
  deleteDevice,
  getDevice,
  getDevices,
} from '../../services/devices.service'

export const fetchDevices = createAsyncThunk('devices/fetchDevices', async (_, { rejectWithValue }) => {
  try {
    return await getDevices()
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching devices')
  }
})

export const fetchDevice = createAsyncThunk(
  'devices/fetchDevice',
  async (id, { rejectWithValue }) => {
    try {
      return await getDevice(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching device')
    }
  }
)

export const addDevice = createAsyncThunk('devices/addDevice', async (deviceData, { rejectWithValue }) => {
  try {
    const response = await createDevice(deviceData)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error creating device')
  }
})

export const updateDevice = createAsyncThunk('devices/updateDevice', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    return await editDevice(id, updatedData)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating device')
  }
})

export const removeDevice = createAsyncThunk('devices/removeDevice', async (id, { rejectWithValue }) => {
  try {
    await deleteDevice(id)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error deleting device')
  }
})

const devicesSlice = createSlice({
  name: 'devices',
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
      .addCase(fetchDevices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.data
      })
  },
})

export const {
  resetApi,
} = devicesSlice.actions
export default devicesSlice.reducer
