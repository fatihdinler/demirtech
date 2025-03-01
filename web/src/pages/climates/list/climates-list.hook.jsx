import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchClimates } from '../../../features/climates/climates.api'
import { fetchBranches } from '../../../features/branches/branches.api'

const useClimatesList = () => {
  const dispatch = useDispatch()

  const { data: climates, isLoading, error, hasFetched } = useSelector(
    (state) => state.climates.api,
    shallowEqual
  )
  const { data: branches, isLoading: isBranchesLoading, error: errorBranches, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)

  const loadClimates = useCallback(() => {
    dispatch(fetchClimates())
  }, [dispatch])

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      loadClimates()
    }
  }, [hasFetched, isLoading, loadClimates])

  const refetch = useCallback(() => {
    loadClimates()
  }, [loadClimates])

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])


  return {
    climates,
    isLoading,
    error,
    refetch,
    branches,
  }
}

export default useClimatesList
