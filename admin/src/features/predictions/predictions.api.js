import { createAsyncThunk } from '@reduxjs/toolkit'
import { _getDeviceForecast } from '../../services/predictions.service'

export const fetchDeviceForecast = createAsyncThunk(
  'predictions/fetchDeviceForecast',
  async (deviceId, { rejectWithValue }) => {
    try {
      const data = await _getDeviceForecast(deviceId)
      return { deviceId, data }
    } catch (error) {
      return rejectWithValue({
        deviceId,
        message: error.response?.data?.message || error.message,
      })
    }
  }
)
