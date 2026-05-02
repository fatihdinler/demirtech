import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  step: 1,
  selectedCustomer: null,
  selectedDevice: null,
}

export const dashboard = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload
    },
    setSelectedDevice: (state, action) => {
      state.selectedDevice = action.payload
    },
  },
})

export const {
  setStep,
  setSelectedCustomer,
  setSelectedDevice,
} = dashboard.actions

export default dashboard.reducer
