import React from 'react'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap'
import useDashboard from './dashboard.hook'
import useRealtimeDeviceData from '../../hooks/socket.hook'
import { Card } from '../../components'
import GaugeComponent from 'react-gauge-component'

const DashboardDeviceSelection = ({ selectedCustomer, selectedBranch, selectedLocation, onBackToLocation }) => {
  const { devices, isDevicesLoading, errorDevices } = useDashboard()
  const realtimeDataMap = useRealtimeDeviceData()

  // Nem için gauge UI
  const humidityGaugeUI = (value) => (
    <GaugeComponent
      value={value}
      type="radial"
      labels={{
        tickLabels: {
          type: "inner",
          ticks: [
            { value: 20 },
            { value: 40 },
            { value: 60 },
            { value: 80 },
            { value: 100 }
          ]
        }
      }}
      arc={{
        colorArray: ['#35d0e5', '#3565e5'],
        subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
        padding: 0.02,
        width: 0.3
      }}
      pointer={{
        elastic: true,
        animationDelay: 0
      }}
    />
  )

  // Sıcaklık için gauge UI
  const temperatureGaugeUI = (value) => (
    <GaugeComponent
      type="semicircle"
      arc={{
        width: 0.2,
        padding: 0.005,
        cornerRadius: 1,
        subArcs: [
          {
            limit: 15,
            color: '#EA4228',
            showTick: true,
            tooltip: { text: 'Too low temperature!' },
            onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
            onMouseMove: () => console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
            onMouseLeave: () => console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
          },
          {
            limit: 17,
            color: '#F5CD19',
            showTick: true,
            tooltip: { text: 'Low temperature!' }
          },
          {
            limit: 28,
            color: '#5BE12C',
            showTick: true,
            tooltip: { text: 'OK temperature!' }
          },
          {
            limit: 30,
            color: '#F5CD19',
            showTick: true,
            tooltip: { text: 'High temperature!' }
          },
          {
            color: '#EA4228',
            tooltip: { text: 'Too high temperature!' }
          }
        ]
      }}
      pointer={{
        color: '#345243',
        length: 0.80,
        width: 15
      }}
      labels={{
        valueLabel: { formatTextValue: value => value + 'ºC' },
        tickLabels: {
          type: 'outer',
          defaultTickValueConfig: {
            formatTextValue: value => value + 'ºC',
            style: { fontSize: 10 }
          },
          ticks: [
            { value: 13 },
            { value: 22.5 },
            { value: 32 }
          ]
        }
      }}
      value={value}
      minValue={10}
      maxValue={35}
    />
  )

  // Realtime veriye göre uygun gauge render edilir
  const renderGauge = (realtime) => {
    if (!realtime) {
      return (
        <div style={{ fontSize: '1.5rem', fontWeight: 'normal', color: '#9ca3af' }}>
          No Data
        </div>
      )
    }
    if (realtime.type.toLowerCase() === 'humidity') {
      return humidityGaugeUI(realtime.value)
    }
    // Varsayılan olarak sıcaklık gauge'ü kullanılır
    return temperatureGaugeUI(realtime.value)
  }

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
          filteredDevices.map(device => {
            const realtime = realtimeDataMap[device.id]
            return (
              <Col key={device.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card
                  title={device.name}
                  description={device.description || 'Açıklama bulunamadı'}
                  extraContent={
                    <div
                      style={{
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f1f5f9',
                        borderRadius: '0.5rem',
                        marginTop: '1rem',
                        padding: '1rem'
                      }}
                    >
                      {renderGauge(realtime)}
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
    <Container fluid className="p-3">
      {renderBreadcrumbs()}
      {renderDevices()}
    </Container>
  )
}

export default DashboardDeviceSelection
