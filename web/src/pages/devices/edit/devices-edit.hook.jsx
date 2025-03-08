import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editDeviceValidator, retrieveSuccessMessage } from './devices-edit.messager'
import {
  setName,
  setDescription,
  setChipId,
  setBranchId,
  setClimateId,
  setDeviceType,
  setMeasurementType,
  setMqttTopic,
  setCustomerId,
  clearPage
} from '../../../features/devices/devices-edit.state'
import { fetchDevice, updateDevice } from '../../../features/devices/devices.api'
import { fetchClimates } from '../../../features/climates/climates.api'
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
    climateId,
    deviceType,
    measurementType,
    mqttTopic,
    customerId,
    branchId,
  } = useSelector(state => state.devices.edit)

  const { data: climates, isLoading: isClimatesLoading, hasFetched: doesClimatesLoaded } = useSelector(state => state.climates.api)
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
    if (!doesClimatesLoaded && !isClimatesLoading) {
      dispatch(fetchClimates())
    }
  }, [doesClimatesLoaded, isClimatesLoading, dispatch])

  useEffect(() => {
    if (climateId && climates?.length > 0) {
      const selectedClimate = climates.find(climate => climate.id === climateId)
      if (selectedClimate && selectedClimate.branchId !== branchId) {
        dispatch(setBranchId(selectedClimate.branchId))
      }
    }
  }, [climateId, climates, branchId, dispatch])

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
          if (response.data.climateId) dispatch(setClimateId(response.data.climateId))
        }
      } catch (error) {
        console.error('Error fetching device:', error)
      }
    }
    if (id) fetchDeviceData()
  }, [dispatch, id])

  const onChange = (event, field) => {
    event.preventDefault()
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
      default:
        break
    }
  }

  const customersOptions = customers?.map(customer => ({ value: customer.id, label: customer.name }))
  const handleCustomersChange = (selectedOption) => {
    dispatch(setCustomerId(selectedOption.value))
    dispatch(setBranchId(null))
    dispatch(setClimateId(null))
  }

  const branchesOptions = customerId
    ? branches?.filter(branch => branch.customerId === customerId)
      .map(branch => ({ value: branch.id, label: branch.name }))
    : []
  const handleBranchesChange = (selectedOption) => {
    dispatch(setBranchId(selectedOption.value))
    dispatch(setClimateId(null))
  }

  const climatesOptions = branchId
    ? climates?.filter(climate => climate.branchId === branchId)
      .map(climate => ({ value: climate.id, label: climate.name }))
    : []
  const handleClimatesChange = (selectedOption) => dispatch(setClimateId(selectedOption.value))

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
      climateId,
      deviceType,
      measurementType,
      mqttTopic,
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
    climateId,
    deviceType,
    measurementType,
    mqttTopic,
    onChange,
    climatesOptions,
    handleClimatesChange,
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
  }
}

export default useDevicesEdit
