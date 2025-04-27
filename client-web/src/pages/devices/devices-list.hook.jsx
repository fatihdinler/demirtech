import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchDevices, resetApi as resetDevicesApi } from '../../features/devices/devices.api'
import { fetchLocations, resetApi as resetLocationsApi } from '../../features/locations/locations.api'

const useDevicesList = () => {
  const dispatch = useDispatch()

  const { data: locations, isLoading: isLocationsLoading, error: errorLocations, hasFetched: doesLocationsLoaded } = useSelector(state => state.locations.api)
  const { data: devices, isLoading: isDevicesLoading, error: errorDevices, hasFetched: doesDevicesLoaded } = useSelector(
    (state) => state.devices.api,
    shallowEqual
  )

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
    }
  }, [dispatch])

  const isPageLoading = isDevicesLoading

  return {
    devices,
    locations,
    refetch,
    isPageLoading,
  }
}

export default useDevicesList
