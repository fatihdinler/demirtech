import { createSlice } from '@reduxjs/toolkit'

const initialState = {
}

export const locationsList = createSlice({
  name: 'locationsList',
  initialState,
  reducers: {
  },
})

export const {
} = locationsList.actions

export default locationsList.reducer