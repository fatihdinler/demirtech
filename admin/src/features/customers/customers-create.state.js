import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  description: null,
}

export const customersCreate = createSlice({
  name: 'customersCreate',
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
} = customersCreate.actions

export default customersCreate.reducer