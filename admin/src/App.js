import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/auth.context'
import { Layout, ProtectedRoute } from './components'
import { Login } from './pages'
import { routes } from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {routes.map((route, index) => (
              <Route key={index} path={route.to} element={route.element} />
            ))}
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Route>
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router>
  )
}

export default App
