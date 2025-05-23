import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editDeviceValidator, retrieveSuccessMessage } from './devices-edit.messager'
import {
  setName,
  setDescription,
  setChipId,
  setBranchId,
  setLocationId,
  setDeviceType,
  setMeasurementType,
  setMqttTopic,
  setCustomerId,
  clearPage,
  setIsActive,
} from '../../../features/devices/devices-edit.state'
import { fetchDevice, updateDevice } from '../../../features/devices/devices.api'
import { fetchLocations } from '../../../features/locations/locations.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { fetchBranches } from '../../../features/branches/branches.api'
import { useNavigate, useParams } from 'react-router-dom'
import { deviceTypes, deviceMeasurementTypes } from '../../../utils/constants'
import useDevicesList from '../list/devices-list.hook'

const useDevicesEdit = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    name,
    description,
    chipId,
    locationId,
    deviceType,
    measurementType,
    mqttTopic,
    customerId,
    branchId,
    isActive,
  } = useSelector(state => state.devices.edit)

  const { data: locations, isLoading: isLocationsLoading, hasFetched: doesLocationsLoaded } = useSelector(state => state.locations.api)
  const { data: customers, isLoading: isCustomersLoading, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)
  const { data: branches, isLoading: isBranchesLoading, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)

  const { refetch: refetchDevicesAfterEditing } = useDevicesList()

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
    if (!doesLocationsLoaded && !isLocationsLoading) {
      dispatch(fetchLocations())
    }
  }, [doesLocationsLoaded, isLocationsLoading, dispatch])

  useEffect(() => {
    if (locationId && locations?.length > 0) {
      const selectedLocation = locations.find(location => location.id === locationId)
      if (selectedLocation && selectedLocation.branchId !== branchId) {
        dispatch(setBranchId(selectedLocation.branchId))
      }
    }
  }, [locationId, locations, branchId, dispatch])

  useEffect(() => {
    if (branchId && branches?.length > 0) {
      const selectedBranch = branches.find(branch => branch.id === branchId)
      if (selectedBranch && selectedBranch.customerId !== customerId) {
        dispatch(setCustomerId(selectedBranch.customerId))
      }
    }
  }, [branchId, branches, customerId, dispatch])

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await dispatch(fetchDevice(id)).unwrap()
        if (response.status === 'SUCCESS') {
          if (response.data.name) dispatch(setName(response.data.name))
          if (response.data.description) dispatch(setDescription(response.data.description))
          if (response.data.chipId) dispatch(setChipId(response.data.chipId))
          if (response.data.deviceType) dispatch(setDeviceType(response.data.deviceType))
          if (response.data.measurementType) dispatch(setMeasurementType(response.data.measurementType))
          if (response.data.mqttTopic) dispatch(setMqttTopic(response.data.mqttTopic))
          if (response.data.locationId) dispatch(setLocationId(response.data.locationId))
          if (response.data.isActive) dispatch(setIsActive(response.data.isActive))
        }
      } catch (error) {
        console.error('Error fetching device:', error)
      }
    }
    if (id) fetchDeviceData()
  }, [dispatch, id])

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
  const handleCustomersChange = (selectedOption) => {
    dispatch(setCustomerId(selectedOption.value))
    dispatch(setBranchId(null))
    dispatch(setLocationId(null))
  }

  const branchesOptions = customerId
    ? branches?.filter(branch => branch.customerId === customerId)
      .map(branch => ({ value: branch.id, label: branch.name }))
    : []
  const handleBranchesChange = (selectedOption) => {
    dispatch(setBranchId(selectedOption.value))
    dispatch(setLocationId(null))
  }

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

  const editDevice = async () => {
    const postData = {
      name,
      description,
      chipId,
      locationId,
      deviceType,
      measurementType,
      mqttTopic,
      isActive,
    }

    const isValid = editDeviceValidator(postData)
    if (isValid) {
      const response = await dispatch(updateDevice({ id, updatedData: postData })).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchDevicesAfterEditing()
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
    mqttTopic,
    onChange,
    locationsOptions,
    handleLocationsChange,
    clearPageHandler,
    editDevice,
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

export default useDevicesEdit
