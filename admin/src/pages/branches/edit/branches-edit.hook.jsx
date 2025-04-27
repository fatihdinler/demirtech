import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editBranchValidator, retrieveSuccessMessage } from './branches-edit.messager'
import {
  setName,
  setAddress,
  setContactInfo,
  setCustomerId,
  setUserIds,
  clearPage
} from '../../../features/branches/branches-edit.state'
import { fetchBranch, updateBranch } from '../../../features/branches/branches.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { fetchUsers } from '../../../features/users/users.api'
import { useNavigate, useParams } from 'react-router-dom'
import useBranchesList from '../list/branches-list.hook'

const useBranchesEdit = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { refetch: refetchBranchesAfterEditing } = useBranchesList()

  const { name, customerId, address, contactInfo, userIds } =
    useSelector(state => state.branches.edit)

  const {
    data: customers,
    isLoading: isCustomersLoading,
    hasFetched: doesCustomersLoaded
  } = useSelector(state => state.customers.api)

  const {
    data: users,
    isLoading: isUsersLoading,
    hasFetched: doesUsersLoaded
  } = useSelector(state => state.users.api)

  // Fetch customers & users
  useEffect(() => {
    if (!doesCustomersLoaded && !isCustomersLoading) {
      dispatch(fetchCustomers())
    }
  }, [doesCustomersLoaded, isCustomersLoading, dispatch])

  useEffect(() => {
    if (!doesUsersLoaded && !isUsersLoading) {
      dispatch(fetchUsers())
    }
  }, [doesUsersLoaded, isUsersLoading, dispatch])

  // Fetch branch data on mount
  useEffect(() => {
    const load = async () => {
      try {
        const resp = await dispatch(fetchBranch(id)).unwrap()
        if (resp.status === 'SUCCESS') {
          const b = resp.data
          dispatch(setName(b.name || ''))
          dispatch(setCustomerId(b.customerId || ''))
          dispatch(setUserIds(Array.isArray(b.userIds) ? b.userIds : []))
          dispatch(setAddress(b.address || ''))
          dispatch(setContactInfo(b.contactInfo || ''))
        }
      } catch (err) {
        console.error('Branch fetch error:', err)
      }
    }
    if (id) load()
  }, [dispatch, id])

  const onChange = (e, field) => {
    e.preventDefault()
    const v = e.target.value
    if (field === 'name') dispatch(setName(v))
    else if (field === 'address') dispatch(setAddress(v))
    else if (field === 'contactInfo') dispatch(setContactInfo(v))
  }

  const customersOptions = customers?.map(c => ({
    value: c.id,
    label: c.name
  })) || []
  const handleCustomersChange = sel =>
    dispatch(setCustomerId(sel?.value || ''))

  const usersOptions = users?.map(u => ({
    value: u.id,
    label: `${u.name} ${u.surname}`
  })) || []
  const handleUsersChange = selectedOptions => {
    const vals = Array.isArray(selectedOptions)
      ? selectedOptions.map(o => o.value)
      : []
    dispatch(setUserIds(vals))
  }

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/branches')
  }

  const editBranch = async () => {
    const postData = { name, customerId, userIds, address, contactInfo }
    if (!editBranchValidator(postData)) return

    const resp = await dispatch(updateBranch({ id, updatedData: postData })).unwrap()
    retrieveSuccessMessage(resp)
    clearPageHandler()
    refetchBranchesAfterEditing()
    navigate('/branches')
  }

  return {
    name,
    customerId,
    address,
    contactInfo,
    userIds,
    onChange,
    editBranch,
    clearPageHandler,
    customersOptions,
    handleCustomersChange,
    usersOptions,
    handleUsersChange,
  }
}

export default useBranchesEdit
