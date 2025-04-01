import useUsersList from './users-list.hook'
import UsersListTable from './users-list.table'
import { ListPagesHeader, Loading } from '../../../components'
import { Container } from 'react-bootstrap'

const UsersList = () => {
  const {
    users,
    isLoading,
    error,
    branches,
  } = useUsersList()
  return (
    <Container fluid>
      <>
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
      </>
    </Container>
  )
}

export default UsersList