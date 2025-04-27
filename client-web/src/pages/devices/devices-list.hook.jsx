import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchDevices, resetApi } from '../../features/devices/devices.api'

const useDevicesList = () => {
  const dispatch = useDispatch()

  const { data: devices, isLoading, error, hasFetched } = useSelector(
    (state) => state.devices.api,
    shallowEqual
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
    return () => {
      dispatch(resetApi())
    }
  }, [dispatch])

  const isPageLoading = isLoading

  return {
    devices,
    error,
    refetch,
    isPageLoading,
  }
}

export default useDevicesList
