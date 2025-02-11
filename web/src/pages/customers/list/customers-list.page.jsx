import useCustomersList from './customers-list.hook'
import CustomersListTable from './customers-list.table'

const CustomersList = () => {
  const {
    customers,
    isLoading,
    error,
    refetch,
  } = useCustomersList({ skipInitialLoad: false })

  return (
    <div>
      <CustomersListTable customers={customers} />
    </div>
  )
}

export default CustomersList