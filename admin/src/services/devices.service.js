import axios from 'axios'

// API base URL
const API_BASE_URL = 'http://localhost:3000/api/devices'

export const _createDevice = async (deviceData) => {
  const response = await axios.post(`${API_BASE_URL}`, deviceData)
  return response.data
}

export const _editDevice = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData)
  return response.data
}

export const _deleteDevice = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getDevice = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getDevices = async () => {
  const response = await axios.get(API_BASE_URL)
  return response.data
}
