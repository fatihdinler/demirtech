import React from 'react'
import { Nav, Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { routes } from '../../routes'
import useSidebar from './sidebar.hook'

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation()

  const sidebarWidth = isSidebarOpen ? 250 : 80

  return (
    <div
      style={{
        width: sidebarWidth,
        minHeight: '100vh',
        backgroundColor: '#343a40',
        color: '#f8f9fa',
        padding: '1rem',
        transition: 'width 0.3s'
      }}
    >
      <div className='d-flex justify-content-end mb-3'>
        <Button
          variant='secondary'
          onClick={toggleSidebar}
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        >
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </Button>
      </div>

      {/* Rotalar */}
      <Nav className='flex-column'>
        {routes.map((route) => {
          if (!route.isSidebarPage) return null
          const active = location.pathname === route.to
          return (
            <Nav.Link
              as={Link}
              to={route.to}
              key={route.to}
              active={active}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: active ? '#495057' : 'transparent',
                color: active ? '#ffffff' : '#ced4da',
                marginBottom: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{route.icon}</span>
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.75rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  {route.label}
                </span>
              )}
              {active && (
                <div
                  style={{
                    marginLeft: 'auto',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#28a745'
                  }}
                ></div>
              )}
            </Nav.Link>
          )
        })}
      </Nav>
    </div>
  )
}

export default Sidebar
