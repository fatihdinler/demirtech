import React from 'react'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap'
import useDashboard from './dashboard.hook'
import useRealtimeDeviceData from '../../hooks/socket.hook'
import { Card } from '../../components'

const DashboardDeviceSelection = ({ selectedCustomer, selectedBranch, selectedLocation, onBackToLocation }) => {
  const { devices, isDevicesLoading, errorDevices } = useDashboard()
  const realtimeDataMap = useRealtimeDeviceData()

  const renderBreadcrumbs = () => (
    <Breadcrumb>
      <Breadcrumb.Item onClick={onBackToLocation}>Lokasyonlar</Breadcrumb.Item>
      <Breadcrumb.Item active>{selectedLocation.name}</Breadcrumb.Item>
    </Breadcrumb>
  )

  const renderDevices = () => {
    if (isDevicesLoading) return <div>Cihazlar yükleniyor...</div>
    if (errorDevices) return <div>Hata: {errorDevices.message}</div>

    const filteredDevices = devices.filter(device => device.locationId === selectedLocation.id)

    return (
      <Row>
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => {
            const realtime = realtimeDataMap[device.id]
            return (
              <Col key={device.id} xs={12} sm={6} md={4} lg={3} className='mb-4'>
                <Card
                  title={device.name}
                  description={device.description || 'Açıklama bulunamadı'}
                  extraContent={
                    <div style={{
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f1f5f9',
                      borderRadius: '0.5rem',
                      marginTop: '1rem'
                    }}>
                      {realtime ? (
                        <div style={{
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          color: realtime.type.toLowerCase() === 'temperature'
                            ? '#e74c3c'
                            : realtime.type.toLowerCase() === 'humidity'
                              ? '#3498db'
                              : '#27ae60'
                        }}>
                          {realtime.value?.toFixed(1)}
                          {realtime.type.toLowerCase() === 'temperature'
                            ? '°C'
                            : realtime.type.toLowerCase() === 'humidity'
                              ? '%'
                              : 'A'}
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: 'normal',
                          color: '#9ca3af'
                        }}>
                          No Data
                        </div>
                      )}
                    </div>
                  }
                  hoverable={false}
                />
              </Col>
            )
          })
        ) : (
          <Col>
            <div>Seçilen lokasyon için cihaz bulunamadı.</div>
          </Col>
        )}
      </Row>
    )
  }

  return (
    <Container fluid>
      {renderBreadcrumbs()}
      {renderDevices()}
    </Container>
  )
}

export default DashboardDeviceSelection