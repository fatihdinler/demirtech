import axios from 'axios'

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/notifications`

export const _getNotifications = async ({ page = 1, limit = 30, unreadOnly = false } = {}) => {
  const response = await axios.get(API_BASE_URL, {
    params: { page, limit, unreadOnly },
  })
  return response.data
}

export const _getUnreadCount = async () => {
  const response = await axios.get(`${API_BASE_URL}/unread-count`)
  return response.data
}

export const _markAsRead = async (notificationId) => {
  const response = await axios.put(`${API_BASE_URL}/${notificationId}/read`)
  return response.data
}

export const _markAllAsRead = async () => {
  const response = await axios.put(`${API_BASE_URL}/mark-all-read`)
  return response.data
}
