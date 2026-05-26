import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  _getNotifications,
  _getUnreadCount,
  _markAsRead,
  _markAllAsRead,
} from '../../services/notifications.service'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await _getNotifications(params)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const data = await _getUnreadCount()
      return data.count
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const markNotificationRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await _markAsRead(notificationId)
      return notificationId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await _markAllAsRead()
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)
