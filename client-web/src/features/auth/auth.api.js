import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = `http://localhost:3000/api`

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationCode, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/verify-email`, { code: verificationCode })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error while verifying email')
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error while verifying email')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email: credentials.email, password: credentials.password })
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
        state.error = action.payload
      })

      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data
        state.isAuthenticated = true
        state.isCheckingAuth = false
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isCheckingAuth = false
        state.isAuthenticated = false
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user, token } = action.payload.data
        state.user = user;
        state.isAuthenticated = true;
        // localStorage veya sessionStorage
        localStorage.setItem('authToken', token)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const {
} = authSlice.actions
export default authSlice.reducer
