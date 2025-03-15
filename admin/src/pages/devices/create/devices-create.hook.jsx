import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDeviceValidator, retrieveSuccessMessage } from './devices-create.messager'
import { setName, setDescription, setChipId, setLocationId, setDeviceType, setMeasurementType, clearPage, setBranchId, setCustomerId, setIsActive, } from '../../../features/devices/devices-create.state'
import { fetchLocations } from '../../../features/locations/locations.api'
import { fetchBranches } from '../../../features/branches/branches.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { addDevice } from '../../../features/devices/devices.api'
import { useNavigate } from 'react-router-dom'
import { deviceTypes, deviceMeasurementTypes } from '../../../utils/constants'
import useDevicesList from '../list/devices-list.hook'

const useDevicesCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name, description, chipId, locationId, deviceType, measurementType, branchId, customerId, isActive } = useSelector(state => state.devices.create)

  const { data: locations, isLoading: isLocationsLoading, hasFetched: doesLocationsLoaded } = useSelector(state => state.locations.api)
  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)
  const { data: branches, isLoading: isBranchesLoading, error: errorBranches, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)

  const { refetch: refetchDevicesAfterCreation } = useDevicesList()

  useEffect(() => {
    if (!doesLocationsLoaded && !isLocationsLoading) {
      dispatch(fetchLocations())
    }
  }, [doesLocationsLoaded, isLocationsLoading, dispatch])

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

  const onChange = (event, field) => {
    switch (field) {
      case 'name':
        dispatch(setName(event.target.value))
        break
      case 'description':
        dispatch(setDescription(event.target.value))
        break
      case 'chipId':
        dispatch(setChipId(event.target.value))
        break
      case 'isActive':
        dispatch(setIsActive(event.target.checked))
        break
      default:
        break
    }
  }

  const customersOptions = customers?.map(customer => ({ value: customer.id, label: customer.name }))
  const handleCustomersChange = (selectedOption) => dispatch(setCustomerId(selectedOption.value))

  const branchesOptions = customerId
    ? branches?.filter(branch => branch.customerId === customerId)
      .map(branch => ({ value: branch.id, label: branch.name }))
    : []
  const handleBranchesChange = (selectedOption) => dispatch(setBranchId(selectedOption.value))

  const locationsOptions = branchId
    ? locations?.filter(location => location.branchId === branchId)
      .map(location => ({ value: location.id, label: location.name }))
    : []
  const handleLocationsChange = (selectedOption) => dispatch(setLocationId(selectedOption.value))

  const deviceTypesOptions = deviceTypes.map(dt => ({ value: dt, label: dt }))
  const handleDeviceTypesChange = (selectedOption) => dispatch(setDeviceType(selectedOption.value))

  const deviceMeasurementTypesOptions = deviceMeasurementTypes.map(dmt => ({ value: dmt, label: dmt }))
  const handleDeviceMeasurementTypesChange = (selectedOption) => dispatch(setMeasurementType(selectedOption.value))

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/devices')
  }

  const createDevice = async () => {
    const postData = {
      name,
      description,
      chipId,
      locationId,
      deviceType,
      measurementType,
      isActive,
    }

    const isValid = createDeviceValidator(postData)
    if (isValid) {
      const response = await dispatch(addDevice(postData)).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchDevicesAfterCreation()
      return navigate('/devices')
    }
  }

  return {
    name,
    description,
    chipId,
    locationId,
    deviceType,
    measurementType,
    onChange,
    locationsOptions,
    handleLocationsChange,
    clearPageHandler,
    createDevice,
    deviceTypesOptions,
    handleDeviceTypesChange,
    deviceMeasurementTypesOptions,
    handleDeviceMeasurementTypesChange,
    customersOptions,
    handleCustomersChange,
    branchesOptions,
    handleBranchesChange,
    customerId,
    branchId,
    isActive,
  }
}

export default useDevicesCreate
