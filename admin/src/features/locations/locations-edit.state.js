import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  description: null,
  branchId: null,
  model: null,
  customerId: null,
}

export const locationsEdit = createSlice({
  name: 'locationsEdit',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setDescription: (state, action) => {
      state.description = action.payload
    },
    setBranchId: (state, action) => {
      state.branchId = action.payload
    },
    setModel: (state, action) => {
      state.model = action.payload
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload
    },
    clearPage: (state) => {
      state.name = initialState.name
      state.description = initialState.description
      state.branchId = initialState.branchId
      state.model = initialState.model
      state.customerId = initialState.customerId
    },
  },
})

export const {
  setName,
  setDescription,
  setBranchId,
  setModel,
  clearPage,
  setCustomerId,
} = locationsEdit.actions

export default locationsEdit.reducer