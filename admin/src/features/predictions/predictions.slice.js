import { createSlice } from '@reduxjs/toolkit'
import { fetchDeviceForecast } from './predictions.api'

const initialState = {
  byDevice: {},
  // byDevice[deviceId] = { data: null, isLoading: false, error: null }
}

const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    clearForecast: (state, action) => {
      delete state.byDevice[action.payload]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceForecast.pending, (state, action) => {
        const id = action.meta.arg
        state.byDevice[id] = { data: null, isLoading: true, error: null }
      })
      .addCase(fetchDeviceForecast.fulfilled, (state, action) => {
        const { deviceId, data } = action.payload
        state.byDevice[deviceId] = { data, isLoading: false, error: null }
      })
      .addCase(fetchDeviceForecast.rejected, (state, action) => {
        const { deviceId, message } = action.payload
        state.byDevice[deviceId] = { data: null, isLoading: false, error: message }
      })
  },
})

export const { clearForecast } = predictionsSlice.actions
export default predictionsSlice.reducer
