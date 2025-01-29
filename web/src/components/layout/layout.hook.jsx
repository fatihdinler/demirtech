import { useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsSidebarOpen } from '../../features/sidebar/sidebar.state'
import { fetchDevices } from '../../features/devices/devices.api'

const useLayout = () => {
  const dispatch = useDispatch()
  const { data: devices, isLoading: isDevicesLoading, error: devicesError } = useSelector((state) => state.devices.api)
  const { isSidebarOpen } = useSelector((state) => state.sidebar)

  useEffect(() => {
    if (!devices || devices.length === 0) {
      dispatch(fetchDevices())
    }
  }, [dispatch, devices])

  const toggleSidebar = useCallback(() => {
    dispatch(setIsSidebarOpen(!isSidebarOpen))
  }, [dispatch, isSidebarOpen])

  return useMemo(() => ({
    devices,
    isDevicesLoading,
    devicesError,
    isSidebarOpen,
    toggleSidebar,
  }), [devices, isDevicesLoading, devicesError, isSidebarOpen, toggleSidebar])
}

export default useLayout