import React from 'react'
import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '../../routes'

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation()
  const sidebarWidth = isSidebarOpen ? 250 : 80

  return (
    <div
      style={{
        width: sidebarWidth,
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#343a40',
        padding: '1rem',
        transition: 'width 0.3s ease',
        borderRight: '1px solid #dee2e6'
      }}
    >
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
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: active ? '#007bff' : '#495057',
                backgroundColor: active ? '#e9ecef' : 'transparent',
                boxShadow: active ? '0 4px 6px rgba(0,0,0,0.05)' : 'none',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{route.icon}</span>
              {isSidebarOpen && (
                <span
                  style={{
                    marginLeft: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  {route.label}
                </span>
              )}
              {active && (
                <div
                  style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff'
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
