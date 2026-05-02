import { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchCustomers } from '../../features/customers/customers.api'
import { fetchBranches } from '../../features/branches/branches.api'
import { fetchDevices } from '../../features/devices/devices.api'
import { fetchLocations } from '../../features/locations/locations.api'
import {
  setStep,
  setSelectedCustomer,
  setSelectedDevice,
} from '../../features/dashboard/dashboard.state'

const useDashboard = () => {
  const dispatch = useDispatch()

  const { step, selectedCustomer, selectedDevice } = useSelector(
    (state) => state.dashboard.dashboard
  )

  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(
    (state) => state.customers.api,
    shallowEqual
  )

  const { data: devices, isLoading: isDevicesLoading, error: errorDevices, hasFetched: doesDevicesLoaded } = useSelector(
    (state) => state.devices.api,
    shallowEqual
  )

  const { data: locations, isLoading: isLocationsLoading, error: errorLocations, hasFetched: doesLocationsLoaded } = useSelector(
    (state) => state.locations.api,
    shallowEqual
  )

  const { data: branches, isLoading: isBranchesLoading, error: errorBranches, hasFetched: doesBranchesLoaded } = useSelector(
    (state) => state.branches.api,
    shallowEqual
  )

  useEffect(() => {
    if (!doesCustomersLoaded && !isCustomersLoading) dispatch(fetchCustomers())
  }, [doesCustomersLoaded, isCustomersLoading, dispatch])

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) dispatch(fetchBranches())
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])

  useEffect(() => {
    if (!doesLocationsLoaded && !isLocationsLoading) dispatch(fetchLocations())
  }, [doesLocationsLoaded, isLocationsLoading, dispatch])

  useEffect(() => {
    if (!doesDevicesLoaded && !isDevicesLoading) dispatch(fetchDevices())
  }, [doesDevicesLoaded, isDevicesLoading, dispatch])

  const handleCustomerSelect = (customer) => {
    dispatch(setSelectedCustomer(customer))
    dispatch(setStep(2))
  }

  const handleBackToCustomer = () => {
    dispatch(setSelectedCustomer(null))
    dispatch(setSelectedDevice(null))
    dispatch(setStep(1))
  }

  const handleDeviceSelect = (device) => {
    dispatch(setSelectedDevice(device))
    dispatch(setStep(3))
  }

  const handleBackToDevices = () => {
    dispatch(setSelectedDevice(null))
    dispatch(setStep(2))
  }

  return {
    customers, isCustomersLoading, errorCustomers,
    branches, isBranchesLoading, errorBranches,
    locations, isLocationsLoading, errorLocations,
    devices, isDevicesLoading, errorDevices,
    step,
    selectedCustomer,
    selectedDevice,
    handleCustomerSelect,
    handleBackToCustomer,
    handleDeviceSelect,
    handleBackToDevices,
  }
}

export default useDashboard
