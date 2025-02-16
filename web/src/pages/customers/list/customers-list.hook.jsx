import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchCustomers } from '../../../features/customers/customers.api'

const useCustomersList = ({ skipInitialLoad = false } = {}) => {
  const dispatch = useDispatch()

  const { data: customers, isLoading, error } = useSelector(
    (state) => state.customers.api,
    shallowEqual
  )

  const loadCustomers = useCallback(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  useEffect(() => {
    if (!skipInitialLoad && (!customers || customers.length === 0) && !isLoading && !error) {
      loadCustomers()
    }
  }, [skipInitialLoad, customers, isLoading, error, loadCustomers])

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
