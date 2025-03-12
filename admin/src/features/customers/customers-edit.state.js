import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  description: null,
}

export const customersEdit = createSlice({
  name: 'customersEdit',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setDescription: (state, action) => {
      state.description = action.payload
    },
    clearPage: (state) => {
      state.name = initialState.name
      state.description = initialState.description
    },
  },
})

export const {
  setName,
  setDescription,
  clearPage,
} = customersEdit.actions

export default customersEdit.reducer