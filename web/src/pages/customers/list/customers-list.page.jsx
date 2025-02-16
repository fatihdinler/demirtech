import useCustomersList from './customers-list.hook'
import CustomersListTable from './customers-list.table'
import { ListPagesHeader } from '../../../components'
import { Container } from 'react-bootstrap'

const CustomersList = () => {
  const {
    customers,
    isLoading,
    error,
    refetch,
  } = useCustomersList({ skipInitialLoad: false })

  return (
    <Container fluid>
      <>
        {isLoading && error === null ? (
          <p>Loading...</p>
        ) : (
          <>
            <ListPagesHeader
              breadcrumbItems={[{ label: 'Müşteriler', link: '/customers' }]}
              navigateTo='/customers/create'
            />
            <CustomersListTable customers={customers} />
          </>
        )}
      </>
    </Container>
  )
}

export default CustomersList