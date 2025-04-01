import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchUsers } from '../../../features/users/users.api'
import { fetchBranches } from '../../../features/branches/branches.api'

const useUsersList = () => {
  const dispatch = useDispatch()

  const { data: users, isLoading, error, hasFetched } = useSelector(
    (state) => state.users.api,
    shallowEqual
  )
  const { data: branches, isLoading: isBranchesLoading, error: errorBranches, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)

  const loadUsers = useCallback(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      loadUsers()
    }
  }, [hasFetched, isLoading, loadUsers])

  const refetch = useCallback(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])


  return {
    users,
    isLoading,
    error,
    refetch,
    branches,
  }
}

export default useUsersList
