import { Table } from '../../../components'
import useBranchesListRemover from './branches-list.remover'

const BranchesListTable = ({ branches }) => {
  const { removeBranchData } = useBranchesListRemover()
  const columns = [
    {
      header: 'Ad',
      accessor: 'name',
      filterable: true,
    },
    {
      header: 'Müşteri',
      accessor: 'customerId',
      filterable: true,
    },
    {
      header: 'Bölge Müdürü',
      accessor: 'regionManagerId',
      filterable: true,
    },
    {
      header: 'Adres',
      accessor: 'address',
      filterable: true,
    },
    {
      header: 'İletişim Bilgisi',
      accessor: 'contactInfo',
      filterable: true,
    },
    {
      header: 'Aksiyonlar',
      accessor: 'actions',
    },
  ]

  return (
    <Table
      data={branches}
      columns={columns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      editRoute={['/branches', '/edit']}
      handleDelete={removeBranchData}
    />
  )
}

export default BranchesListTable
