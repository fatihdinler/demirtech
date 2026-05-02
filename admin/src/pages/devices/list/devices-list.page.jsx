import useDevicesList from './devices-list.hook'
import DevicesListTable from './devices-list.table'
import { ListPagesHeader, Loading } from '../../../components'

const DevicesList = () => {
  const { devices, isLoading, error, locations } = useDevicesList()

  return (
    <div>
      {isLoading && error === null ? (
        <Loading />
      ) : (
        <>
          <ListPagesHeader
            breadcrumbItems={[{ label: 'Cihazlar', link: '/devices' }]}
            navigateTo='/devices/create'
          />
          <DevicesListTable devices={devices} locations={locations} />
        </>
      )}
    </div>
  )
}

export default DevicesList
