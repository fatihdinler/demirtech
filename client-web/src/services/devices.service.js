import axios from 'axios'

// API base URL
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/devices`

export const _getDevicesByUserId = async () => {
  const response = await axios.get(`${API_BASE_URL}/get-devices-by-user-id`)
  return response.data
}
