import React from 'react'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap'
import useDashboard from './dashboard.hook'
import { Card } from '../../components'

const DashboardCustomerSelection = ({ onCustomerSelect }) => {
  const { customers, isCustomersLoading, errorCustomers } = useDashboard()

  const renderBreadcrumbs = () => (
    <Breadcrumb>
      <Breadcrumb.Item active>Müşteriler</Breadcrumb.Item>
    </Breadcrumb>
  )

  const renderCustomerSelection = () => {
    if (isCustomersLoading) return <div>Müşteriler yükleniyor...</div>
    if (errorCustomers) return <div>Hata: {errorCustomers.message}</div>

    return (
      <Row>
        {customers.map((customer) => (
          <Col key={customer.id} xs={12} sm={6} md={4} lg={3} className='mb-4'>
            <Card
              title={customer.name}
              description={customer.description || 'Açıklama bulunamadı'}
              onClick={() => onCustomerSelect(customer)}
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
      {renderCustomerSelection()}
    </Container>
  )
}

export default DashboardCustomerSelection
