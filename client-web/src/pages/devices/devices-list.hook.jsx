import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchDevices, resetApi as resetDevicesApi, fetchDeviceReports, } from '../../features/devices/devices.api'
import { fetchLocations, resetApi as resetLocationsApi, } from '../../features/locations/locations.api'
import { setSelectedDevices as setSelectedDevicesReducer, setStartTime, setEndTime, clearState as clearDevicesListState, } from '../../features/devices/devices-list.state'
import { generateReportPdfForDevices } from '../../utils/generate-report-pdf-for-devices'

const useDevicesList = () => {
  const dispatch = useDispatch()

  const {
    data: locations,
    isLoading: isLocationsLoading,
    hasFetched: doesLocationsLoaded,
  } = useSelector((state) => state.locations.api)

  const {
    data: devices,
    isLoading: isDevicesLoading,
    hasFetched: doesDevicesLoaded,
    isReportLoading,
  } = useSelector((state) => state.devices.api, shallowEqual)

  const { selectedDevices, startTime, endTime } = useSelector(
    (state) => state.devices.list
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

  const handleTimeApply = (evt, picker) => {
    const startIso = picker.startDate.toDate().toISOString()
    const endIso = picker.endDate.toDate().toISOString()
    dispatch(setStartTime(startIso))
    dispatch(setEndTime(endIso))
  }

  const handleGetReport = async () => {
    if (selectedDevices.length === 0 || !startTime || !endTime) {
      console.warn('Lütfen önce cihazları ve tarih aralığını seçin.')
      return
    }

    const resultAction = await dispatch(
      fetchDeviceReports({
        deviceIds: selectedDevices,
        startTime,
        endTime,
      })
    )

    if (fetchDeviceReports.fulfilled.match(resultAction)) {
      console.log('🗒 Rapor verileri:', resultAction.payload)
      const reportData = resultAction.payload
      console.log('🗒 Rapor verileri:', reportData)

      generateReportPdfForDevices(reportData, devices)
      dispatch(clearDevicesListState())
    } else {
      console.error('❌ Rapor alınamadı:', resultAction.payload)
    }
  }

  return {
    devices,
    locations,
    isPageLoading: isDevicesLoading,
    selectedDevices,
    startTime,
    endTime,
    setSelectedDevices,
    handleTimeApply,
    handleGetReport,
    isReportLoading,
  }
}

export default useDevicesList
