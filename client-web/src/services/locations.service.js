import axios from 'axios'

// API base URL
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/locations`

export const _getLocationsByUserId = async () => {
  const response = await axios.get(`${API_BASE_URL}/get-locations-by-user-id`)
  return response.data
}