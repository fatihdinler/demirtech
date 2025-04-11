import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = `http://localhost:3000/api`

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationCode, { rejectWithValue }) => {
    try {
      console.log('verificationCode')
      const response = await axios.post(`${API_URL}/users/verify-email`, { code: verificationCode })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error while verifying email')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data
        state.isAuthenticated = true
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.data
      })
  },
})

export const {
} = authSlice.actions
export default authSlice.reducer
