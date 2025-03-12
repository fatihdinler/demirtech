import { createSlice } from '@reduxjs/toolkit'

const initialState = {
}

export const customersList = createSlice({
  name: 'customersList',
  initialState,
  reducers: {
  },
})

export const {
} = customersList.actions

export default customersList.reducer