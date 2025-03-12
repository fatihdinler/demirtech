import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchBranches } from '../../../features/branches/branches.api'
import { fetchCustomers } from '../../../features/customers/customers.api'

const useBranchesList = () => {
  const dispatch = useDispatch()

  const { data: branches, isLoading, error, hasFetched } = useSelector(
    (state) => state.branches.api,
    shallowEqual
  )
  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)

  const loadBranches = useCallback(() => {
    dispatch(fetchBranches())
  }, [dispatch])

  useEffect(() => {
    if (!doesCustomersLoaded && !isCustomersLoading) {
      dispatch(fetchCustomers())
    }
  }, [doesCustomersLoaded, isCustomersLoading, dispatch])

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      loadBranches()
    }
  }, [hasFetched, isLoading, loadBranches])


  const refetch = useCallback(() => {
    loadBranches()
  }, [loadBranches])

  return {
    branches,
    isLoading,
    error,
    refetch,
    customers,
  }
}

export default useBranchesList
