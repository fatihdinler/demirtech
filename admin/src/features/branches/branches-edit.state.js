import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  customerId: null,
  regionManagerId: null,
  address: null,
  contactInfo: null,
}

export const branchesEdit = createSlice({
  name: 'branchesEdit',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload
    },
    setRegionManagerId: (state, action) => {
      state.regionManagerId = action.payload
    },
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setContactInfo: (state, action) => {
      state.contactInfo = action.payload
    },
    clearPage: (state) => {
      state.name = initialState.name
      state.customerId = initialState.customerId
      state.regionManagerId = initialState.regionManagerId
      state.address = initialState.address
      state.contactInfo = initialState.contactInfo
    },
  },
})

export const {
  setName,
  setAddress,
  setContactInfo,
  setCustomerId,
  setRegionManagerId,
  clearPage,
} = branchesEdit.actions

export default branchesEdit.reducer