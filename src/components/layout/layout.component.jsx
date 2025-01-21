import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar.component'
import Sidebar from './sidebar.component'

function Layout() {
  const [devices, setDevices] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='min-h-screen flex bg-gray-50 text-textColor'>
      <Sidebar
        devices={devices}
        setDevices={setDevices}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className='flex-1 flex flex-col'>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className='p-4'>
          <Outlet context={[devices, setDevices]} />
        </main>
      </div>
    </div>
  )
}

export default Layout
