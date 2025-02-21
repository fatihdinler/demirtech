import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchBranches } from '../../../features/branches/branches.api'

const useBranchesList = () => {
  const dispatch = useDispatch()

  const { data: branches, isLoading, error, hasFetched } = useSelector(
    (state) => state.branches.api,
    shallowEqual
  )

  const loadBranches = useCallback(() => {
    dispatch(fetchBranches())
  }, [dispatch])

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      loadBranches()
    }
  }, [hasFetched, isLoading, loadBranches])

  const refetch = useCallback(() => {
    loadBranches()
  }, [loadBranches])

  return {
    branches,
    isLoading,
    error,
    refetch,
  }
}

export default useBranchesList
