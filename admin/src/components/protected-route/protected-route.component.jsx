import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth.context'

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!auth.token) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
