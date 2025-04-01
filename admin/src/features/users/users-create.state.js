import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  surname: null,
  username: null,
  password: null,
  email: null,
  branchId: null,
  role: null,
  customerId: null,
}

export const usersCreate = createSlice({
  name: 'usersCreate',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setSurname: (state, action) => {
      state.surname = action.payload
    },
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
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
    setCustomerId: (state, action) => {
      state.customerId = action.payload
    },
    clearPage: (state) => {
      state.name = initialState.name
      state.surname = initialState.surname
      state.username = initialState.username
      state.password = initialState.password
      state.email = initialState.email
      state.branchId = initialState.branchId
      state.role = initialState.role
      state.customerId = initialState.customerId
    },
  },
})

export const {
  setName,
  setSurname,
  setUsername,
  setPassword,
  setEmail,
  setBranchId,
  setRole,
  clearPage,
  setCustomerId,
} = usersCreate.actions

export default usersCreate.reducer