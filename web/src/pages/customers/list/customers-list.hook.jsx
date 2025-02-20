import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchCustomers } from '../../../features/customers/customers.api'

const useCustomersList = () => {
  const dispatch = useDispatch()

  const { data: customers, isLoading, error, hasFetched } = useSelector(
    (state) => state.customers.api,
    shallowEqual
  )

  const loadCustomers = useCallback(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      loadCustomers()
    }
  }, [hasFetched, isLoading, loadCustomers])

  const refetch = useCallback(() => {
    loadCustomers()
  }, [loadCustomers])

  return {
    customers,
    isLoading,
    error,
    refetch,
  }
}

export default useCustomersList
