import { createSlice } from '@reduxjs/toolkit'
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from './notifications.api'

const initialState = {
  items: [],
  unreadCount: 0,
  total: 0,
  isLoading: false,
  error: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addRealtimeNotification: (state, action) => {
      state.items.unshift(action.payload)
      state.unreadCount += 1
      state.total += 1
      if (state.items.length > 50) {
        state.items = state.items.slice(0, 50)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.notifications
        state.unreadCount = action.payload.unreadCount
        state.total = action.payload.total
        state.isLoading = false
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload
        const item = state.items.find(n => n.id === id)
        if (item && !item.isRead) {
          item.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach(n => { n.isRead = true })
        state.unreadCount = 0
      })
  },
})

export const { addRealtimeNotification } = notificationsSlice.actions
export default notificationsSlice.reducer
