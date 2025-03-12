import { Table } from '../../../components'
import useCustomersRemover from './customers-list.remover'

const CustomersListTable = ({ customers }) => {
  const { removeCustomerData } = useCustomersRemover()
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
      header: 'Aksiyonlar',
      accessor: 'actions',
    },
  ]

  return (
    <Table
      data={customers}
      columns={columns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      editRoute={['/customers', '/edit']}
      handleDelete={removeCustomerData}
    />
  )
}

export default CustomersListTable
