import React from 'react'
import { Nav, Button, ListGroup } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaTabletAlt } from 'react-icons/fa'
import { routes } from '../../routes'
import useSidebar from './sidebar.hook'
import { ModalCreateDevice } from '../modal'

const Sidebar = ({ devices, isSidebarOpen, toggleSidebar }) => {
  const { isModalOpen, setIsModalOpen, handleDeviceClick } = useSidebar()
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

      <hr style={{ borderColor: '#495057', margin: '1rem 0' }} />

      {isSidebarOpen && (
        <h6
          style={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: '#adb5bd',
            marginBottom: '1rem'
          }}
        >
          Cihazlar
        </h6>
      )}

      <ListGroup variant='flush' style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
        {devices.map((device) => {
          const activeDevice = location.pathname === `/device-detail/${device.id}`
          return (
            <ListGroup.Item
              key={device.id}
              action
              onClick={() => handleDeviceClick(device.id)}
              active={activeDevice}
              style={{
                backgroundColor: activeDevice ? '#495057' : 'transparent',
                border: 'none',
                color: activeDevice ? '#ffffff' : '#ced4da',
                cursor: 'pointer',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem'
              }}
            >
              <FaTabletAlt style={{ fontSize: '1.25rem' }} />
              {isSidebarOpen && (
                <span style={{ marginLeft: '0.75rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  {device.name}
                </span>
              )}
              {activeDevice && (
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
            </ListGroup.Item>
          )
        })}
      </ListGroup>

      {/* Modal (Cihaz ekleme) */}
      {isModalOpen && (
        <ModalCreateDevice setIsModalOpen={setIsModalOpen} devices={devices} />
      )}
    </div>
  )
}

export default Sidebar
