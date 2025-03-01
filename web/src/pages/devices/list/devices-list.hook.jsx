import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchDevices } from '../../../features/devices/devices.api'
import { fetchClimates } from '../../../features/climates/climates.api'

const useDevicesList = () => {
  const dispatch = useDispatch()

  // Cihaz verileri
  const { data: devices, isLoading, error, hasFetched } = useSelector(
    (state) => state.devices.api,
    shallowEqual
  )

  // Klima verileri (Cihazların climate bilgisini göstermek için)
  const { data: climates, isLoading: isClimatesLoading, hasFetched: doesClimatesLoaded } = useSelector(
    (state) => state.climates.api
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
    if (!doesClimatesLoaded && !isClimatesLoading) {
      dispatch(fetchClimates())
    }
  }, [doesClimatesLoaded, isClimatesLoading, dispatch])

  return {
    devices,
    isLoading,
    error,
    refetch,
    climates,
  }
}

export default useDevicesList
