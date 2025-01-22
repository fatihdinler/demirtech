import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  description: null,
  chipId: null,
  min: null,
  max: null,
  tolerance: null,
  measurementType: null,
  modelName: null,
  color: null,
}

export const devicesEdit = createSlice({
  name: 'devicesEdit',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setDescription: (state, action) => {
      state.description = action.payload
    },
    setChipId: (state, action) => {
      state.chipId = action.payload
    },
    setMin: (state, action) => {
      state.min = action.payload
    },
    setMax: (state, action) => {
      state.max = action.payload
    },
    setTolerance: (state, action) => {
      state.tolerance = action.payload
    },
    setMeasurementType: (state, action) => {
      state.measurementType = action.payload
    },
    setModelName: (state, action) => {
      state.modelName = action.payload
    },
    setColor: (state, action) => {
      state.color = action.payload
    },
    clearPage: (state) => {
      state.name = initialState.name
      state.description = initialState.description
      state.chipId = initialState.chipId
      state.min = initialState.min
      state.max = initialState.max
      state.tolerance = initialState.tolerance
      state.measurementType = initialState.measurementType
      state.modelName = initialState.modelName
      state.color = initialState.color
    },
  },
})

export const {
  setName,
  setDescription,
  setChipId,
  setMin,
  setMax,
  setTolerance,
  setMeasurementType,
  setModelName,
  setColor,
  clearPage,
} = devicesEdit.actions

export default devicesEdit.reducer