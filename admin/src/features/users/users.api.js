import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  _createUser,
  _deleteUser,
  _editUser,
  _getUser,
  _getUsers,
} from '../../services/user.service'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return await _getUsers()
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching users')
  }
})

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (id, { rejectWithValue }) => {
    try {
      return await _getUser(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching branch')
    }
  }
)

export const addUser = createAsyncThunk('users/addUser', async (data, { rejectWithValue }) => {
  try {
    const response = await _createUser(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error creating branch')
  }
})

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    return await _editUser(id, updatedData)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating branch')
  }
})

export const removeBranch = createAsyncThunk('users/removeBranch', async (id, { rejectWithValue }) => {
  try {
    return await _deleteUser(id)
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error deleting branch')
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    resetApi: (state) => {
      state.data = []
      state.isLoading = false
      state.error = null
      state.hasFetched = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.hasFetched = true
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.data
        state.hasFetched = true
      })
  },
})


export const {
  resetApi,
} = usersSlice.actions
export default usersSlice.reducer
