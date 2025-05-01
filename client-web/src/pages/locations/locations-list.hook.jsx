// pages/locations-list/locations-list.hook.jsx

import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import {
  fetchLocations,
  fetchLocationReports,
  resetApi as resetLocationsApi
} from '../../features/locations/locations.api'
import {
  setSelectedLocations,
  setStartTime,
  setEndTime,
  clearState as clearLocationsListState
} from '../../features/locations/locations-list.state'
import { generateReportPdfForLocations } from '../../utils/generate-report-pdf-for-locations'

const useLocationsList = () => {
  const dispatch = useDispatch()

  const { data: locations, isLoading: isLocationsLoading, hasFetched } = useSelector(
    state => state.locations.api, shallowEqual
  )

  const {
    selectedLocations,
    startTime,
    endTime
  } = useSelector(state => state.locations.list)

  const { isReportLoading } = useSelector(state => state.locations.api)

  // load locations once
  useEffect(() => {
    if (!hasFetched && !isLocationsLoading) dispatch(fetchLocations())
  }, [hasFetched, isLocationsLoading, dispatch])

  // cleanup on unmount
  useEffect(() => () => {
    dispatch(resetLocationsApi())
    dispatch(clearLocationsListState())
  }, [dispatch])

  const onSelectionChange = ids => dispatch(setSelectedLocations(ids))

  const handleTimeApply = (evt, picker) => {
    dispatch(setStartTime(picker.startDate.toDate().toISOString()))
    dispatch(setEndTime(picker.endDate.toDate().toISOString()))
  }

  const handleGetReport = async () => {
    if (!selectedLocations.length || !startTime || !endTime) {
      console.warn('Lütfen önce lokasyonları ve tarih aralığını seçin.')
      return
    }
    const result = await dispatch(fetchLocationReports({
      locationIds: selectedLocations,
      startTime, endTime
    }))
    if (fetchLocationReports.fulfilled.match(result)) {
      generateReportPdfForLocations(result.payload, locations)
      dispatch(clearLocationsListState())
    } else {
      console.error('❌ Lokasyon raporu alınamadı:', result.payload)
    }
  }

  return {
    locations,
    isPageLoading: isLocationsLoading,
    selectedLocations,
    startTime,
    endTime,
    onSelectionChange,
    handleTimeApply,
    handleGetReport,
    isReportLoading
  }
}

export default useLocationsList
