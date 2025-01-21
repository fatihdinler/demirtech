import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components'
import { Dashboard, DeviceDetail } from './pages'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/device/:id' element={<DeviceDetail />} />
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
