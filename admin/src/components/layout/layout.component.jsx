import React from 'react'
import { Row, Col } from 'react-bootstrap'
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Row className='g-0'>
        <Col xs='auto' style={{ padding: 0, ...sidebarStyle }}>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </Col>

        <Col style={{ padding: 0 }}>
          <Navbar />
          <div style={{ padding: '1rem' }}>
            <Outlet />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Layout
