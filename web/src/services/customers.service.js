import axios from 'axios'

// API base URL
const API_BASE_URL = 'http://localhost:3000/api/customers'

export const createCustomer = async (deviceData) => {
  const response = await axios.post(`${API_BASE_URL}`, deviceData)
  return response.data
}

export const editCustomer = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData)
  return response.data
}

export const deleteCustomer = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`)
  return response.data
}

export const getCustomer = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

export const getCustomers = async () => {
  const response = await axios.get(API_BASE_URL)
  return response.data
}
