import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  step: 1,
  selectedCustomer: null,
  selectedBranch: null,
  selectedLocation: null,
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
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload
    },
  },
})

export const {
  setStep,
  setSelectedCustomer,
  setSelectedBranch,
  setSelectedLocation,
} = dashboard.actions

export default dashboard.reducer