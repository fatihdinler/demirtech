import useCustomersList from './customers-list.hook'
import CustomersListTable from './customers-list.table'
import { ListPagesHeader, Loading } from '../../../components'
import { Container } from 'react-bootstrap'

const CustomersList = () => {
  const {
    customers,
    isLoading,
    error,
  } = useCustomersList()

  return (
    <Container fluid>
      <>
        {isLoading && error === null ? (
          <Loading />
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