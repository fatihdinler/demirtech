import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components'
import { Login } from './pages'
import { routes } from './routes'
import { ToastContainer } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth, clearState } from './features/auth/auth.api'
import 'react-toastify/dist/ReactToastify.css'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth.api)
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }
  if (!user.isVerified) {
    return <Navigate to='verify-email' replace />
  }

  return children
}

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth.api)
  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }

  return children
}

const App = () => {
  const dispatch = useDispatch()
  const { error } = useSelector(state => state.auth.api)

  useEffect(() => {
    dispatch(checkAuth())
    dispatch(clearState())
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route path='/login'
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>}
        />
        <Route element={<Layout />}>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.to}
              element={
                <ProtectedRoute>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router >
  )
}

export default App
