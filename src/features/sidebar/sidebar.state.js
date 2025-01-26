import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSidebarOpen: false,
  isModalOpen: false,
}

export const sidebarSlice = createSlice({
  name: 'sidebarSlice',
  initialState,
  reducers: {
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload
    }
  },
})

export const {
  setIsSidebarOpen,
  setIsModalOpen,
} = sidebarSlice.actions

export default sidebarSlice.reducer