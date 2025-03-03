import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchCustomers } from '../../features/customers/customers.api'
import { fetchBranches } from '../../features/branches/branches.api'
import { fetchDevices } from '../../features/devices/devices.api'
import { fetchClimates } from '../../features/climates/climates.api'

const useDashboard = () => {
  const dispatch = useDispatch()

  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(
    (state) => state.customers.api,
    shallowEqual
  )

  const { data: devices, isLoading: isDevicesLoading, error: errorDevices, hasFetched: doesDevicesLoaded } = useSelector(
    (state) => state.devices.api,
    shallowEqual
  )

  const { data: climates, isLoading: isClimatesLoading, error: errorClimates, hasFetched: doesClimatesLoaded } = useSelector(
    (state) => state.climates.api,
    shallowEqual
  )

  const { data: branches, isLoading: isBranchesLoading, error: errorBranches, hasFetched: doesBranchesLoaded } = useSelector(
    (state) => state.branches.api,
    shallowEqual
  )

  useEffect(() => {
    if (!doesCustomersLoaded && !isCustomersLoading) {
      dispatch(fetchCustomers())
    }
  }, [doesCustomersLoaded, isCustomersLoading, dispatch])

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])

  useEffect(() => {
    if (!doesClimatesLoaded && !isClimatesLoading) {
      dispatch(fetchClimates())
    }
  }, [doesClimatesLoaded, isClimatesLoading, dispatch])

  useEffect(() => {
    if (!doesDevicesLoaded && !isDevicesLoading) {
      dispatch(fetchDevices())
    }
  }, [doesDevicesLoaded, isDevicesLoading, dispatch])

  return {
    customers,
    isCustomersLoading,
    errorCustomers,
    branches,
    isBranchesLoading,
    errorBranches,
    climates,
    isClimatesLoading,
    errorClimates,
    devices,
    isDevicesLoading,
    errorDevices,
  }
}

export default useDashboard