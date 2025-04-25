import React, { useState } from 'react'
import { Container, Breadcrumb } from 'react-bootstrap'
import useDashboard from './dashboard.hook'
import useRealtimeDeviceData from '../../hooks/socket.hook'
import {
  FaThermometerHalf,
  FaTint,
  FaExclamationTriangle
} from 'react-icons/fa'

const DashboardDeviceSelection = ({
  selectedLocation,
  onBackToLocation
}) => {
  const { devices, isDevicesLoading, errorDevices } = useDashboard()
  const realtimeDataMap = useRealtimeDeviceData()
  const [activeDevice, setActiveDevice] = useState(null)

  const getValueStatus = (type, value) => {
    const t = type.toLowerCase()
    if (t === 'temperature' || t === 'sicaklik') {
      if (value < 15 || value > 30) return 'critical'
      if (value < 17 || value > 28) return 'warning'
      return 'normal'
    }
    if (t === 'humidity' || t === 'nem') {
      if (value < 30 || value > 70) return 'warning'
      if (value < 20 || value > 80) return 'critical'
      return 'normal'
    }
    return 'normal'
  }

  const renderBreadcrumbs = () => (
    <Breadcrumb className='mb-4'>
      <Breadcrumb.Item onClick={onBackToLocation}>
        Lokasyonlar
      </Breadcrumb.Item>
      <Breadcrumb.Item active>
        {selectedLocation.name}
      </Breadcrumb.Item>
    </Breadcrumb>
  )

  const renderDeviceCard = (device) => {
    const realtime = realtimeDataMap[device.id]
    const isActive = activeDevice === device.id

    let icon = <FaExclamationTriangle size={24} />
    let reading = 'N/A'
    let unit = ''
    let status = 'normal'

    if (realtime) {
      const val = Number(realtime.value)
      reading = val.toFixed(2)
      if (realtime.type.toLowerCase() === 'humidity' || realtime.type.toLowerCase() === 'nem') {
        icon = <FaTint size={24} />
        unit = '%'
      } else {
        icon = <FaThermometerHalf size={24} />
        unit = '°C'
      }
      status = getValueStatus(realtime.type, val)
    }

    return (
      <div
        key={device.id}
        className={`device-card ${isActive ? 'active' : ''} ${status}`}
        onClick={() => setActiveDevice(device.id)}
      >
        <div className='device-header'>
          <div className='device-name'>{device.name}</div>
          <div className='device-icon'>{icon}</div>
        </div>
        <div className='device-reading'>
          <span className='reading-value'>{reading}</span>
          <span className='reading-unit'>{unit}</span>
        </div>
        <div className='device-description'>
          {device.chipId}
        </div>
      </div>
    )
  }

  const renderDevices = () => {
    if (isDevicesLoading)
      return <div className='loading-indicator'>Cihazlar yükleniyor...</div>
    if (errorDevices)
      return <div className='error-message'>Hata: {errorDevices.message}</div>

    const filtered = devices.filter(
      (d) => d.locationId === selectedLocation.id
    )

    return filtered.length ? (
      <div className='device-grid'>
        {filtered.map(renderDeviceCard)}
      </div>
    ) : (
      <div className='empty-state'>
        Seçilen lokasyon için cihaz bulunamadı.
      </div>
    )
  }

  return (
    <Container fluid className='dashboard-container'>
      {renderBreadcrumbs()}
      <div className='dashboard-content'>{renderDevices()}</div>
    </Container>
  )
}

export default DashboardDeviceSelection
