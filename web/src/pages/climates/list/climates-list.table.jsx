import { Table } from '../../../components'
import useClimatesListRemover from './climates-list.remover'

const ClimateListTable = ({ climates, branches, }) => {
  const { removeClimateData } = useClimatesListRemover()

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
      data={climates}
      columns={columns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      editRoute={['/climates', '/edit']}
      handleDelete={removeClimateData}
    />
  )
}

export default ClimateListTable
