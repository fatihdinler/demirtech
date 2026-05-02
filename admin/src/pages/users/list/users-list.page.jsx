import useUsersList from './users-list.hook'
import UsersListTable from './users-list.table'
import { ListPagesHeader, Loading } from '../../../components'

const UsersList = () => {
  const { users, isLoading, error, branches } = useUsersList()

  return (
    <div>
      {isLoading && error === null ? (
        <Loading />
      ) : (
        <>
          <ListPagesHeader
            breadcrumbItems={[{ label: 'Kullanıcılar', link: '/users' }]}
            navigateTo='/users/create'
          />
          <UsersListTable users={users} branches={branches} />
        </>
      )}
    </div>
  )
}

export default UsersList
