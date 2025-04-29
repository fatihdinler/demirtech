import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchDevices, resetApi as resetDevicesApi } from '../../features/devices/devices.api'
import { fetchLocations, resetApi as resetLocationsApi } from '../../features/locations/locations.api'
import { setSelectedDevices as setSelectedDevicesReducer, setStartTime, setEndTime, clearState as clearDevicesListState } from '../../features/devices/devices-list.state'

const useDevicesList = () => {
  const dispatch = useDispatch()

  const { data: locations, isLoading: isLocationsLoading, error: errorLocations, hasFetched: doesLocationsLoaded } = useSelector(state => state.locations.api)
  const { data: devices, isLoading: isDevicesLoading, error: errorDevices, hasFetched: doesDevicesLoaded } = useSelector(
    (state) => state.devices.api,
    shallowEqual
  )
  const { selectedDevices, startTime, endTime } = useSelector(state => state.devices.list)

  const loadDevices = useCallback(() => {
    dispatch(fetchDevices())
  }, [dispatch])

  useEffect(() => {
    if (!doesDevicesLoaded && !isDevicesLoading) {
      loadDevices()
    }
  }, [doesDevicesLoaded, isDevicesLoading, loadDevices])

  useEffect(() => {
    if (!doesLocationsLoaded && !isLocationsLoading) {
      dispatch(fetchLocations())
    }
  }, [doesLocationsLoaded, isLocationsLoading, dispatch])

  const refetch = useCallback(() => {
    loadDevices()
  }, [loadDevices])

  useEffect(() => {
    return () => {
      dispatch(resetDevicesApi())
      dispatch(resetLocationsApi())
      dispatch(clearDevicesListState())
    }
  }, [dispatch])

  const setSelectedDevices = (devices) => {
    dispatch(setSelectedDevicesReducer(devices))
  }

  const setStartTimeHandler = useCallback(
    date => dispatch(setStartTime(date)),
    [dispatch]
  )
  const setEndTimeHandler = useCallback(
    date => dispatch(setEndTime(date)),
    [dispatch]
  )

  const handleTimeApply = (evt, picker) => {
    dispatch(setStartTime(picker.startDate.toDate()))
    dispatch(setEndTime(picker.endDate.toDate()))
  }

  const handleGetReport = () => {
    console.log('Rapor al:', selectedDevices, startTime, endTime)
  }

  const isPageLoading = isDevicesLoading

  return {
    devices,
    locations,
    refetch,
    isPageLoading,
    selectedDevices,
    startTime,
    endTime,
    setSelectedDevices,
    setStartTime: setStartTimeHandler,
    setEndTime: setEndTimeHandler,
    handleTimeApply,
    handleGetReport,
  }
}

export default useDevicesList
