import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  description: null,
  chipId: null,
  locationId: null,
  deviceType: null,
  measurementType: null,
  mqttTopic: null,
  customerId: null,
  branchId: null,
  isActive: false,
  minValue: '',
  maxValue: '',
  environment: 'sealed',
  cooling: true,
  defrostCycle: false,
  frequentAccess: false,
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
    setLocationId: (state, action) => {
      state.locationId = action.payload
    },
    setDeviceType: (state, action) => {
      state.deviceType = action.payload
    },
    setMeasurementType: (state, action) => {
      state.measurementType = action.payload
    },
    setMqttTopic: (state, action) => {
      state.mqttTopic = action.payload
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload
    },
    setBranchId: (state, action) => {
      state.branchId = action.payload
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload
    },
    setMinValue: (state, action) => {
      state.minValue = action.payload
    },
    setMaxValue: (state, action) => {
      state.maxValue = action.payload
    },
    setEnvironment: (state, action) => {
      state.environment = action.payload
    },
    setCooling: (state, action) => {
      state.cooling = action.payload
    },
    setDefrostCycle: (state, action) => {
      state.defrostCycle = action.payload
    },
    setFrequentAccess: (state, action) => {
      state.frequentAccess = action.payload
    },
    clearPage: (state) => {
      state.name = initialState.name
      state.description = initialState.description
      state.chipId = initialState.chipId
      state.branchId = initialState.branchId
      state.locationId = initialState.locationId
      state.deviceType = initialState.deviceType
      state.measurementType = initialState.measurementType
      state.mqttTopic = initialState.mqttTopic
      state.customerId = initialState.customerId
      state.branchId = initialState.branchId
      state.isActive = initialState.isActive
      state.minValue = initialState.minValue
      state.maxValue = initialState.maxValue
      state.environment = initialState.environment
      state.cooling = initialState.cooling
      state.defrostCycle = initialState.defrostCycle
      state.frequentAccess = initialState.frequentAccess
    },
  },
})

export const {
  setName,
  setDescription,
  setChipId,
  setLocationId,
  setDeviceType,
  setMeasurementType,
  setMqttTopic,
  clearPage,
  setCustomerId,
  setBranchId,
  setIsActive,
  setMinValue,
  setMaxValue,
  setEnvironment,
  setCooling,
  setDefrostCycle,
  setFrequentAccess,
} = devicesCreate.actions

export default devicesCreate.reducer