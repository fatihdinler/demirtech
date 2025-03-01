import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  description: null,
  chipId: null,
  branchId: null,
  climateId: null,
  deviceType: null,
  deviceLocationType: null,
  measurementType: null,
  mqttTopic: null,
}

export const devicesCreate = createSlice({
  name: 'devicesCreate',
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
    setBranchId: (state, action) => {
      state.branchId = action.payload
    },
    setClimateId: (state, action) => {
      state.climateId = action.payload
    },
    setDeviceType: (state, action) => {
      state.deviceType = action.payload
    },
    setDeviceLocationType: (state, action) => {
      state.deviceLocationType = action.payload
    },
    setMeasurementType: (state, action) => {
      state.measurementType = action.payload
    },
    setMqttTopic: (state, action) => {
      state.mqttTopic = action.payload
    },
    clearPage: (state) => {
      state.name = initialState.name
      state.description = initialState.description
      state.chipId = initialState.chipId
      state.branchId = initialState.branchId
      state.climateId = initialState.climateId
      state.deviceType = initialState.deviceType
      state.deviceLocationType = initialState.deviceLocationType
      state.measurementType = initialState.measurementType
      state.mqttTopic = initialState.mqttTopic
    },
  },
})

export const {
  setName,
  setDescription,
  setChipId,
  setBranchId,
  setClimateId,
  setDeviceType,
  setDeviceLocationType,
  setMeasurementType,
  setMqttTopic,
  clearPage,
} = devicesCreate.actions

export default devicesCreate.reducer