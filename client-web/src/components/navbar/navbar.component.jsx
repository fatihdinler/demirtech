import React from 'react'
import { Navbar as RBNavbar, Container, Nav, Badge, Dropdown, Button } from 'react-bootstrap'
import { FaBell, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import DemirtekLogoSecondary from '../../assets/demirtek-logo-secondary.png'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/auth.api'

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth.api)

  const logoutFromApplication = () => {
    // dispatch logout action (also clears token in reducer)
    dispatch(logout())
    // navigate back to login screen
    navigate('/login')
  }

  return (
    <RBNavbar
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s ease'
      }}
      className='py-1'
    >
      <Container fluid className='d-flex justify-content-between align-items-center'>
        {/* Sidebar toggle */}
        <div>
          <Button
            variant='outline-secondary'
            onClick={toggleSidebar}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </Button>
        </div>

        <RBNavbar.Brand className='mx-auto'>
          <img
            src={DemirtekLogoSecondary}
            alt='Demirtek Logo Secondary'
            style={{
              height: '48px',
              objectFit: 'contain',
              transition: 'transform 0.3s ease'
            }}
          />
        </RBNavbar.Brand>

        <Nav className='d-flex align-items-center'>
          <div
            style={{
              position: 'relative',
              marginRight: '1.5rem',
              cursor: 'pointer'
            }}
          >
            <FaBell size={20} color='#6c757d' />
            <Badge
              pill
              bg='danger'
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                fontSize: '0.7rem'
              }}
            >
              3
            </Badge>
          </div>
          <Dropdown align='end'>
            <Dropdown.Toggle
              variant='light'
              id='dropdown-user'
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FaUserCircle size={28} color='#6c757d' />
              <span
                className='ms-2 d-none d-sm-inline'
                style={{ fontWeight: 500, color: '#495057' }}
              >
                {user?.name} {user?.surname}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ minWidth: '150px' }}>
              <Dropdown.Item
                onClick={logoutFromApplication}
                className='d-flex align-items-center'
              >
                <FaSignOutAlt size={16} color='#dc3545' className='me-2' />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </RBNavbar>
  )
}

export default Navbar
