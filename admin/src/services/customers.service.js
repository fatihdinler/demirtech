import axios from 'axios'

// API base URL
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/customers`

export const _createCustomer = async (deviceData) => {
  const response = await axios.post(`${API_BASE_URL}`, deviceData)
  return response.data
}

export const _editCustomer = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData)
  return response.data
}

export const _deleteCustomer = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getCustomer = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

export const _getCustomers = async () => {
  const response = await axios.get(API_BASE_URL)
  return response.data
}
