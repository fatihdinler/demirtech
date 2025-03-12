import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchDevices } from '../../../features/devices/devices.api'
import { fetchLocations } from '../../../features/locations/locations.api'

const useDevicesList = () => {
  const dispatch = useDispatch()

  // Cihaz verileri
  const { data: devices, isLoading, error, hasFetched } = useSelector(
    (state) => state.devices.api,
    shallowEqual
  )

  const { data: locations, isLoading: isLocationsLoading, hasFetched: doesLocationsLoaded } = useSelector(
    (state) => state.locations.api
  )

  const loadDevices = useCallback(() => {
    dispatch(fetchDevices())
  }, [dispatch])

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      loadDevices()
    }
  }, [hasFetched, isLoading, loadDevices])

  const refetch = useCallback(() => {
    loadDevices()
  }, [loadDevices])

  useEffect(() => {
    if (!doesLocationsLoaded && !isLocationsLoading) {
      dispatch(fetchLocations())
    }
  }, [doesLocationsLoaded, isLocationsLoading, dispatch])

  return {
    devices,
    isLoading,
    error,
    refetch,
    locations,
  }
}

export default useDevicesList
