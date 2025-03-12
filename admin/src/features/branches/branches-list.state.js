import { createSlice } from '@reduxjs/toolkit'

const initialState = {
}

export const branchesList = createSlice({
  name: 'branchesList',
  initialState,
  reducers: {
  },
})

export const {
} = branchesList.actions

export default branchesList.reducer