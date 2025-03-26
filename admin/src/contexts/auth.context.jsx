import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken)
        if (decoded.exp * 1000 > Date.now()) {
          setAuth({ token: storedToken, user: decoded })
          const expirationTime = decoded.exp * 1000 - Date.now()
          setTimeout(() => {
            logout()
          }, expirationTime)
        } else {
          localStorage.removeItem('accessToken')
        }
      } catch (error) {
        localStorage.removeItem('accessToken')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password })
      const token = response.data.token
      const decoded = jwtDecode(token)
      setAuth({ token, user: decoded })
      localStorage.setItem('accessToken', token)

      const expirationTime = decoded.exp * 1000 - Date.now()
      setTimeout(() => {
        logout()
      }, expirationTime)

      navigate('/dashboard')
      return true
    } catch (error) {
      console.error('Giriş başarısız:', error.response?.data || error.message)
      return false
    }
  }

  const logout = async () => {
    try {
      if (auth.token) {
        await axios.post('http://localhost:3000/api/auth/logout', null, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
      }
    } catch (error) {
      console.error('Çıkış yapma hatası:', error.response?.data || error.message)
    } finally {
      setAuth({ token: null, user: null })
      localStorage.removeItem('accessToken')
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
