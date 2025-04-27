import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth, logout } from './features/auth/auth.api'
import { Login, VerifyEmail } from './pages'
import { Layout } from './components'
import { routes } from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector(s => s.auth.api)
  if (!isAuthenticated) return <Navigate to='/login' replace />
  if (!user.isVerified) return <Navigate to='/verify-email' replace />
  return children
}

function RedirectAuthenticatedUser({ children }) {
  const { isAuthenticated, user } = useSelector(s => s.auth.api)
  if (isAuthenticated && user.isVerified) return <Navigate to='/' replace />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const { isCheckingAuth } = useSelector(s => s.auth.api)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // checkAuth sürerken bir yükleme yapabilirsiniz
  if (isCheckingAuth) return null

  return (
    <Router>
      <Routes>
        <Route path='/login'
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route element={<Layout />}>
          {routes.map((r, i) => (
            <Route key={i} path={r.to}
              element={<ProtectedRoute>{r.element}</ProtectedRoute>}
            />
          ))}
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  )
}
