import axios from 'axios'

// API base URL
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/branches`

export const _createBranch = async (data) => {
  const response = await axios.post(`${API_BASE_URL}`, data)
  return response.data
}

export const _editBranch = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data)
  return response.data
}

export const _deleteBranch = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getBranch = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getBranches = async () => {
  const response = await axios.get(API_BASE_URL)
  return response.data
}
