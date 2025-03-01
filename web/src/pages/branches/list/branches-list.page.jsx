import useBranchesList from './branches-list.hook'
import BranchesListTable from './branches-list.table'
import { ListPagesHeader, Loading } from '../../../components'
import { Container } from 'react-bootstrap'

const BranchesList = () => {
  const {
    branches,
    isLoading,
    error,
    customers,
  } = useBranchesList()
  return (
    <Container fluid>
      <>
        {isLoading && error === null ? (
          <Loading />
        ) : (
          <>
            <ListPagesHeader
              breadcrumbItems={[{ label: 'Şubeler', link: '/branches' }]}
              navigateTo='/branches/create'
            />
            <BranchesListTable branches={branches} customers={customers} />
          </>
        )}
      </>
    </Container>
  )
}

export default BranchesList