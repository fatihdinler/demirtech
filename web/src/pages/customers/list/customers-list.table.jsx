import React from 'react'
import { Table } from '../../../components'

const CustomersListTable = ({ customers }) => {
  const columns = [
    {
      header: 'Ad',
      accessor: 'name',
      filterable: true,
    },
    {
      header: 'Description',
      accessor: 'description',
      filterable: true,
    },
    {
      header: 'Actions',
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
    />
  )
}

export default CustomersListTable
