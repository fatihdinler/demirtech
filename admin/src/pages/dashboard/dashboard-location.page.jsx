import React from 'react'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap'
import useDashboard from './dashboard.hook'
import { Card } from '../../components'

const DashboardLocationSelection = ({ selectedCustomer, selectedBranch, onLocationSelect, onBackToBranch }) => {
  const { locations, isLocationsLoading, errorLocations } = useDashboard()

  const renderBreadcrumbs = () => (
    <Breadcrumb className='d-flex justify-content-between align-items-center mx-2'>
      <Breadcrumb.Item onClick={onBackToBranch}>Şubeler</Breadcrumb.Item>
      <Breadcrumb.Item active>{selectedBranch.name}</Breadcrumb.Item>
    </Breadcrumb>
  )

  const renderLocationSelection = () => {
    if (isLocationsLoading) return <div>Lokasyonlar yükleniyor...</div>
    if (errorLocations) return <div>Hata: {errorLocations.message}</div>

    const filteredLocations = locations.filter(location => location.branchId === selectedBranch.id)

    return (
      <Row>
        {filteredLocations.map((location) => (
          <Col key={location.id} xs={12} sm={6} md={4} lg={3} className=''>
            <Card
              title={location.name}
              description={location.description || 'Açıklama bulunamadı'}
              onClick={() => onLocationSelect(location)}
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
      {renderLocationSelection()}
    </Container>
  )
}

export default DashboardLocationSelection
