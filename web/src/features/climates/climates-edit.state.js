import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  description: null,
  branchId: null,
  model: null,
}

export const climatesEdit = createSlice({
  name: 'climatesEdit',
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
    clearPage: (state) => {
      state.name = initialState.name
      state.description = initialState.description
      state.branchId = initialState.branchId
      state.model = initialState.model
    },
  },
})

export const {
  setName,
  setDescription,
  setBranchId,
  setModel,
  clearPage,
} = climatesEdit.actions

export default climatesEdit.reducer