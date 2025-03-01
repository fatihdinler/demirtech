import axios from 'axios'

// API base URL
const API_BASE_URL = 'http://localhost:3000/api/climates'

export const _createClimate = async (data) => {
  const response = await axios.post(`${API_BASE_URL}`, data)
  return response.data
}

export const _editClimate = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data)
  return response.data
}

export const _deleteClimate = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getClimate = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getClimates = async () => {
  const response = await axios.get(API_BASE_URL)
  return response.data
}