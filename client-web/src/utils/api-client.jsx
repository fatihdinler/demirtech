import axios from 'axios'

// API URL’ınızı .env’den çekin
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Her isteğe Authorization ekle
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tüm 401 hatalarını yakala, token’ı temizle, login’e götür
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      // Geçerli sayfayı tekrar yüklemeye gerek yoksa doğrudan:
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
