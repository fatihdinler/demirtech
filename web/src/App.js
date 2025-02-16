import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components'
import { routes } from './routes'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {routes.map((route, index) => (
            <Route key={index} path={route.to} element={route.element} />
          ))}
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
