import { Table } from '../../../components'
import useDeviceRemover from './devices-list.remover'

const DevicesListTable = ({ devices, branches, locations }) => {
  const { removeDeviceData } = useDeviceRemover()

  const columns = [
    {
      header: 'Ad',
      accessor: 'name',
      filterable: true,
    },
    {
      header: 'Açıklama',
      accessor: 'description',
      filterable: true,
    },
    {
      header: 'Chip ID',
      accessor: 'chipId',
      filterable: true,
    },
    {
      header: 'Lokasyon',
      accessor: 'locationId',
      filterable: true,
      render: (value) => {
        const location = locations.find(c => c.id === value)
        return location ? location.name : value
      }
    },
    {
      header: 'Cihaz Tipi',
      accessor: 'deviceType',
      filterable: true,
    },
    {
      header: 'Ölçüm Tipi',
      accessor: 'measurementType',
      filterable: true,
    },
    {
      header: 'MQTT Topic',
      accessor: 'mqttTopic',
      filterable: true,
    },
    {
      header: 'Aksiyonlar',
      accessor: 'actions',
    },
  ]

  return (
    <Table
      data={devices}
      columns={columns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      editRoute={['/devices', '/edit']}
      handleDelete={removeDeviceData}
    />
  )
}

export default DevicesListTable
