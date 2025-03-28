import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: null,
  email: null,
  branchId: null,
  role: null,
}

export const usersEdit = createSlice({
  name: 'usersEdit',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload
    },
    setBranchId: (state, action) => {
      state.branchId = action.payload
    },
    setRole: (state, action) => {
      state.role = action.payload
    },
    clearPage: (state) => {
      state.username = initialState.username
      state.email = initialState.email
      state.branchId = initialState.branchId
      state.role = initialState.role
    },
  },
})

export const {
  setUsername,
  setEmail,
  setBranchId,
  setRole,
  clearPage,
} = usersEdit.actions

export default usersEdit.reducer