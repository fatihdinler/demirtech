import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import useDevicesList from './devices-list.hook'
import { SelectableDeviceCard, ListPagesHeader } from '../../components'

const DevicesList = () => {
  const { devices, refetch, isPageLoading, locations, } = useDevicesList()
  const [selectedDevices, setSelectedDevices] = useState([])
  console.log('locations -->', locations)

  return (
    <Container fluid>
      <ListPagesHeader
        breadcrumbItems={[{ label: 'Cihazlar', link: '/devices' }]}
      />
      <SelectableDeviceCard
        devices={devices}
        locations={locations}
        selectedIds={selectedDevices}
        onSelectionChange={setSelectedDevices}
      />
    </Container>
  )
}

export default DevicesList
