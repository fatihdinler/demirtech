import useCustomersList from './customers-list.hook'
import CustomersListTable from './customers-list.table'
import { ListPagesHeader, Loading } from '../../../components'

const CustomersList = () => {
  const { customers, isLoading, error } = useCustomersList()

  return (
    <div>
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
    </div>
  )
}

export default CustomersList
