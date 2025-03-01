import useDevicesList from './devices-list.hook'
import DevicesListTable from './devices-list.table'
import { ListPagesHeader, Loading } from '../../../components'
import { Container } from 'react-bootstrap'

const DevicesList = () => {
  const { devices, isLoading, error, climates } = useDevicesList()

  return (
    <Container fluid>
      {isLoading && error === null ? (
        <Loading />
      ) : (
        <>
          <ListPagesHeader
            breadcrumbItems={[{ label: 'Cihazlar', link: '/devices' }]}
            navigateTo='/devices/create'
          />
          <DevicesListTable devices={devices} climates={climates} />
        </>
      )}
    </Container>
  )
}

export default DevicesList
