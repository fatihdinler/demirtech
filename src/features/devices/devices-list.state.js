import { createSlice } from '@reduxjs/toolkit'

const initialState = {
}

export const devicesList = createSlice({
  name: 'devicesList',
  initialState,
  reducers: {
  },
})

export const {
} = devicesList.actions

export default devicesList.reducer