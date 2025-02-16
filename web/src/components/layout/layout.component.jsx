import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FaPlus } from 'react-icons/fa'
import { Sidebar, Navbar } from '../../components'
import useLayout from './layout.hook'
import { setIsModalOpen } from '../../features/sidebar/sidebar.state'

const Layout = () => {
  const { devices, isSidebarOpen, toggleSidebar } = useLayout()
  const dispatch = useDispatch()

  const sidebarStyle = {
    minWidth: isSidebarOpen ? 250 : 80,
    transition: 'all 0.3s'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Row className="g-0">
        <Col xs="auto" style={{ padding: 0, ...sidebarStyle }}>
          <Sidebar
            devices={devices}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </Col>

        {/* Sütun 2: İçerik alanı (geri kalan tüm genişliği kaplar) */}
        <Col style={{ padding: 0 }}>
          <Navbar />
          <div style={{ padding: '1rem' }}>
            <Outlet context={[devices]} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Layout
