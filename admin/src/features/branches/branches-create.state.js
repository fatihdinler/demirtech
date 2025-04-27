import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  customerId: null,
  userIds: null,
  address: null,
  contactInfo: null,
}

export const branchesCreate = createSlice({
  name: 'branchesCreate',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload
    },
    setUserIds: (state, action) => {
      state.userIds = action.payload
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
      state.userIds = initialState.userIds
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
  setUserIds,
  clearPage,
} = branchesCreate.actions

export default branchesCreate.reducer