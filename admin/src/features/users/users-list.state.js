import { createSlice } from '@reduxjs/toolkit'

const initialState = {
}

export const usersList = createSlice({
  name: 'usersList',
  initialState,
  reducers: {
  },
})

export const {
} = usersList.actions

export default usersList.reducer