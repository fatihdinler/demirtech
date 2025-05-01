import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedDevices: [],
  startTime: null,
  endTime: null,
}

export const devicesList = createSlice({
  name: 'devicesList',
  initialState,
  reducers: {
    setSelectedDevices: (state, action) => {
      state.selectedDevices = action.payload
    },
    setStartTime: (state, action) => {
      state.startTime = action.payload
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload
    },
    clearState: (state) => {
      state.selectedDevices = []
      state.startTime = null
      state.endTime = null
    },
  },
})

export const {
  setSelectedDevices,
  setStartTime,
  setEndTime,
  clearState,
} = devicesList.actions

export default devicesList.reducer