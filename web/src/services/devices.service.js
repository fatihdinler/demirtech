import axios from 'axios'

// API base URL
const API_BASE_URL = 'http://localhost:4000/api/devices'

export const createDevice = async (deviceData) => {
  const response = await axios.post(`${API_BASE_URL}`, deviceData)
  return response.data
}

export const editDevice = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData)
  return response.data
}

export const deleteDevice = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`)
  return response.data
}

export const getDevice = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

export const getDevices = async () => {
  const response = await axios.get(API_BASE_URL)
  return response.data
}
