import { Table } from '../../../components'
import useLocationsListRemover from './locations-list.remover'

const LocationListTable = ({ locations, branches, }) => {
  const { removeLocationData } = useLocationsListRemover()

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
      header: 'Şube',
      accessor: 'branchId',
      filterable: true,
      render: (value, row) => {
        const branch = branches.find(branch => branch.id === value)
        return branch ? branch.name : value
      }
    },
    {
      header: 'Model',
      accessor: 'model',
      filterable: true,
    },
    {
      header: 'Aksiyonlar',
      accessor: 'actions',
    },
  ]

  return (
    <Table
      data={locations}
      columns={columns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      editRoute={['/locations', '/edit']}
      handleDelete={removeLocationData}
    />
  )
}

export default LocationListTable
