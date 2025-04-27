import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchLocations, resetApi } from '../../features/locations/locations.api'

const useLocationsList = () => {
  const dispatch = useDispatch()

  const { data: locations, isLoading, error, hasFetched } = useSelector(
    (state) => state.locations.api,
    shallowEqual
  )

  const loadLocations = useCallback(() => {
    dispatch(fetchLocations())
  }, [dispatch])

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      loadLocations()
    }
  }, [hasFetched, isLoading, loadLocations])

  const refetch = useCallback(() => {
    loadLocations()
  }, [loadLocations])

  useEffect(() => {
    return () => {
      dispatch(resetApi())
    }
  }, [dispatch])

  const isPageLoading = isLoading

  return {
    locations,
    error,
    refetch,
    isPageLoading,
  }
}

export default useLocationsList
