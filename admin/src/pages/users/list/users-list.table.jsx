import { Table } from '../../../components'
import useUsersListRemover from './users-list.remover'

const UsersListTable = ({ users, branches, }) => {
  const { removeUserData } = useUsersListRemover()

  const columns = [
    {
      header: 'Ad',
      accessor: 'name',
      filterable: true,
    },
    {
      header: 'Soyad',
      accessor: 'surname',
      filterable: true,
    },
    {
      header: 'Kullanıcı Adı',
      accessor: 'username',
      filterable: true,
    },
    {
      header: 'E-mail',
      accessor: 'email',
      filterable: true,
    },
    {
      header: 'Rol',
      accessor: 'role',
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
      header: 'Aksiyonlar',
      accessor: 'actions',
    },
  ]

  return (
    <Table
      data={users}
      columns={columns}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      editRoute={['/users', '/edit']}
      handleDelete={removeUserData}
    />
  )
}

export default UsersListTable
