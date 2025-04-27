import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../utils/api-client'

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationCode, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/users/verify-email', { code: verificationCode })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Email doğrulama hatası')
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/auth/check-auth')
      return data
    } catch (err) {
      // 401 zaten interceptor ile handle ediliyor
      return rejectWithValue(err.response?.data || 'Oturum doğrulama hatası')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Giriş hatası')
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
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.isLoading = false
      localStorage.removeItem('authToken')
    }
  },
  extraReducers: builder => {
    builder
      // verifyEmail…
      .addCase(verifyEmail.fulfilled, (state, { payload }) => {
        state.user = payload.data
        state.isAuthenticated = true
        state.error = null
        state.isLoading = false
      })
      // checkAuth…
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.user = payload.data
        state.isAuthenticated = true
        state.isCheckingAuth = false
        state.error = null
      })
      .addCase(checkAuth.rejected, state => {
        state.isCheckingAuth = false
        state.isAuthenticated = false
        // hata zaten interceptor’da yönlendirdi
      })
      // login…
      .addCase(login.fulfilled, (state, { payload }) => {
        const { user, token } = payload.data
        state.user = user
        state.isAuthenticated = true
        state.isLoading = false
        localStorage.setItem('authToken', token)
      })
      .addCase(login.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
