import axios from 'axios'

// API base URL
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/users`

export const _createUser = async (data) => {
  const response = await axios.post(`${API_BASE_URL}`, data)
  return response.data
}

export const _editUser = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data)
  return response.data
}

export const _deleteUser = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getUser = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getUsers = async () => {
  const response = await axios.get(API_BASE_URL)
  return response.data
}