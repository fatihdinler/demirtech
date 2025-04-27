import { Table } from '../../../components'
import useBranchesListRemover from './branches-list.remover'

const BranchesListTable = ({ branches, customers, users, }) => {
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
      render: (value, row) => {
        const customer = customers.find(cust => cust.id === value)
        return customer ? customer.name : value
      }
    },
    {
      header: 'Kullanıcı',
      accessor: 'userIds',
      filterable: true,
      render: (value, row) => {
        const user = users.find(user => user.id === value)
        return user ? user.name : value
      }
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
      defaultPageSize={20}
      pageSizeOptions={[5, 10, 20]}
      editRoute={['/branches', '/edit']}
      handleDelete={removeBranchData}
    />
  )
}

export default BranchesListTable
