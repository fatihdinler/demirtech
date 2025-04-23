import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: null,
  password: null,
}

export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    }
  },
})

export const {
  setEmail,
  setPassword,
} = loginSlice.actions

export default loginSlice.reducer