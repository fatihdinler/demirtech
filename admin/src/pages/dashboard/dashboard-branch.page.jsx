import React from 'react'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap'
import useDashboard from './dashboard.hook'
import { Card } from '../../components'

const DashboardBranchSelection = ({ selectedCustomer, onBranchSelect, onBackToCustomer }) => {
  const { branches, isBranchesLoading, errorBranches } = useDashboard()

  const renderBreadcrumbs = () => (
    <Breadcrumb className='d-flex justify-content-between align-items-center mx-2'>
      <Breadcrumb.Item onClick={onBackToCustomer}>Müşteriler</Breadcrumb.Item>
      <Breadcrumb.Item active>{selectedCustomer.name}</Breadcrumb.Item>
    </Breadcrumb>
  )

  const renderBranchSelection = () => {
    if (isBranchesLoading) return <div>Şubeler yükleniyor...</div>
    if (errorBranches) return <div>Hata: {errorBranches.message}</div>

    const filteredBranches = branches.filter(branch => branch.customerId === selectedCustomer.id)

    return (
      <Row>
        {filteredBranches.map((branch) => (
          <Col key={branch.id} xs={12} sm={6} md={4} lg={3} className='mb-4'>
            <Card
              title={branch.name}
              description={branch.address || 'Adres bilgisi bulunamadı'}
              onClick={() => onBranchSelect(branch)}
              hoverable
            />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <Container fluid>
      {renderBreadcrumbs()}
      {renderBranchSelection()}
    </Container>
  )
}

export default DashboardBranchSelection
