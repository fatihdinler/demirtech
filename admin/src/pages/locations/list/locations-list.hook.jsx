import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchLocations } from '../../../features/locations/locations.api'
import { fetchBranches } from '../../../features/branches/branches.api'

const useLocationsList = () => {
  const dispatch = useDispatch()

  const { data: locations, isLoading, error, hasFetched } = useSelector(
    (state) => state.locations.api,
    shallowEqual
  )
  const { data: branches, isLoading: isBranchesLoading, error: errorBranches, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)

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
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])


  return {
    locations,
    isLoading,
    error,
    refetch,
    branches,
  }
}

export default useLocationsList
