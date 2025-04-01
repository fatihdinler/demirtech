import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, Navbar } from '../../components'
import useLayout from './layout.hook'

const Layout = () => {
  const { isSidebarOpen, toggleSidebar } = useLayout()

  const sidebarStyle = {
    minWidth: isSidebarOpen ? 250 : 80,
    transition: 'all 0.3s'
  }

  return (
    <div className='app-container'>
      <header className='app-navbar'>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </header>
      <div className='app-body'>
        <aside className='app-sidebar' style={sidebarStyle}>
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </aside>
        <main className='app-content'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
