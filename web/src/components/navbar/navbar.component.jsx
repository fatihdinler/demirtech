import React from 'react'
import { Navbar as RBNavbar, Container, Nav, Badge } from 'react-bootstrap'
import { FaBell, FaUserCircle } from 'react-icons/fa'
import DemirtekLogoSecondary from '../../assets/demirtek-logo-secondary.png'

const Navbar = () => {
  return (
    <RBNavbar bg='light' className='border-bottom'>
      <Container fluid className='d-flex justify-content-between align-items-center'>
        {/* Sol kısımda boş bir alan isterseniz ileride ekleyebilirsiniz */}
        <div style={{ width: '40px' }}></div>
        <RBNavbar.Brand className='mx-auto'>
          <img
            src={DemirtekLogoSecondary}
            alt='Demirtek Logo Secondary'
            style={{ height: '48px', objectFit: 'contain' }}
          />
        </RBNavbar.Brand>
        <Nav className='d-flex align-items-center'>
          <div style={{ position: 'relative', marginRight: '1rem', cursor: 'pointer' }}>
            <FaBell size={20} color='#6c757d' />
            <Badge pill bg='danger' style={{ position: 'absolute', top: '-4px', right: '-8px' }}>
              3
            </Badge>
          </div>
          <div className='d-flex align-items-center' style={{ cursor: 'pointer' }}>
            <FaUserCircle size={24} color='#6c757d' />
            <span className='ms-1 d-none d-sm-inline'>John Doe</span>
          </div>
        </Nav>
      </Container>
    </RBNavbar>
  )
}

export default Navbar
