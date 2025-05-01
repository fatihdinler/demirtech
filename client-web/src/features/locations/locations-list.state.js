import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocations: [],
  startTime: null,
  endTime: null,
}

export const locationsList = createSlice({
  name: 'locationsList',
  initialState,
  reducers: {
    setSelectedLocations: (state, action) => {
      state.selectedLocations = action.payload
    },
    setStartTime: (state, action) => {
      state.startTime = action.payload
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload
    },
    clearState: (state) => {
      state.selectedLocations = []
      state.startTime = null
      state.endTime = null
    },
  },
})

export const {
  setSelectedLocations,
  setStartTime,
  setEndTime,
  clearState,
} = locationsList.actions

export default locationsList.reducer
