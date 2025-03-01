import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDeviceValidator, retrieveSuccessMessage } from './devices-create.messager'
import { setName, setDescription, setChipId, setBranchId, setClimateId, setDeviceType, setDeviceLocationType, setMeasurementType, setMqttTopic, clearPage } from '../../../features/devices/devices-create.state'
import { fetchClimates } from '../../../features/climates/climates.api'
import { addDevice } from '../../../features/devices/devices.api'
import { useNavigate } from 'react-router-dom'
import { deviceTypes, deviceLocationTypes, deviceMeasurementTypes } from '../../../utils/constants'
import useDevicesList from '../list/devices-list.hook'

const useDevicesCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name, description, chipId, climateId, deviceType, deviceLocationType, measurementType } = useSelector(state => state.devices.create)

  const { data: climates, isLoading: isClimatesLoading, hasFetched: doesClimatesLoaded } = useSelector(state => state.climates.api)

  const { refetch: refetchDevicesAfterCreation } = useDevicesList()

  useEffect(() => {
    if (!doesClimatesLoaded && !isClimatesLoading) {
      dispatch(fetchClimates())
    }
  }, [doesClimatesLoaded, isClimatesLoading, dispatch])

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

  const climatesOptions = climates?.map(climate => ({ value: climate.id, label: climate.name }))
  const handleClimatesChange = (selectedOption) => dispatch(setClimateId(selectedOption.value))

  const deviceTypesOptions = deviceTypes.map(dt => ({ value: dt, label: dt }))
  const handleDeviceTypesChange = (selectedOption) => dispatch(setDeviceType(selectedOption.value))

  const deviceLocationTypesOptions = deviceLocationTypes.map(dlt => ({ value: dlt, label: dlt }))
  const handleDeviceLocationTypesChange = (selectedOption) => dispatch(setDeviceLocationType(selectedOption.value))

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
      climateId,
      deviceType,
      deviceLocationType,
      measurementType,
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
    climateId,
    deviceType,
    deviceLocationType,
    measurementType,
    onChange,
    climatesOptions,
    handleClimatesChange,
    clearPageHandler,
    createDevice,
    deviceTypesOptions,
    handleDeviceTypesChange,
    deviceLocationTypesOptions,
    handleDeviceLocationTypesChange,
    deviceMeasurementTypesOptions,
    handleDeviceMeasurementTypesChange,
  }
}

export default useDevicesCreate
