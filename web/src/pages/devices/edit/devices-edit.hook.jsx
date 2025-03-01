import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editDeviceValidator, retrieveSuccessMessage } from './devices-edit.messager'
import { setName, setDescription, setChipId, setBranchId, setClimateId, setDeviceType, setDeviceLocationType, setMeasurementType, setMqttTopic, clearPage } from '../../../features/devices/devices-edit.state'
import { fetchDevice, updateDevice } from '../../../features/devices/devices.api'
import { fetchClimates } from '../../../features/climates/climates.api'
import { useNavigate, useParams } from 'react-router-dom'
import { deviceTypes, deviceLocationTypes, deviceMeasurementTypes } from '../../../utils/constants'
import useDevicesList from '../list/devices-list.hook'

const useDevicesEdit = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { name, description, chipId, climateId, deviceType, deviceLocationType, measurementType, mqttTopic } = useSelector(state => state.devices.edit)

  const { data: climates, isLoading: isClimatesLoading, hasFetched: doesClimatesLoaded } = useSelector(state => state.climates.api)
  const { refetch: refetchDevicesAfterEditing } = useDevicesList()

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await dispatch(fetchDevice(id)).unwrap()
        if (response.status === 'SUCCESS') {
          if (response.data.name) dispatch(setName(response.data.name))
          if (response.data.description) dispatch(setDescription(response.data.description))
          if (response.data.chipId) dispatch(setChipId(response.data.chipId))
          if (response.data.climateId) dispatch(setClimateId(response.data.climateId))
          if (response.data.deviceType) dispatch(setDeviceType(response.data.deviceType))
          if (response.data.deviceLocationType) dispatch(setDeviceLocationType(response.data.deviceLocationType))
          if (response.data.measurementType) dispatch(setMeasurementType(response.data.measurementType))
          if (response.data.mqttTopic) dispatch(setMqttTopic(response.data.mqttTopic))
        }
      } catch (error) {
        console.error('Error fetching device:', error)
      }
    }
    if (id) fetchDeviceData()
  }, [dispatch, id])

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

  const editDevice = async () => {
    const postData = {
      name,
      description,
      chipId,
      climateId,
      deviceType,
      deviceLocationType,
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
    deviceLocationType,
    measurementType,
    mqttTopic,
    onChange,
    climatesOptions,
    handleClimatesChange,
    clearPageHandler,
    editDevice,
    deviceTypesOptions,
    handleDeviceTypesChange,
    deviceLocationTypesOptions,
    handleDeviceLocationTypesChange,
    deviceMeasurementTypesOptions,
    handleDeviceMeasurementTypesChange,
  }
}

export default useDevicesEdit
