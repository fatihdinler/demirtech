import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setName,
  setSurname,
  setUsername,
  setBranchId,
  setEmail,
  setPassword,
  setRole,
  setCustomerId,
  clearPage
} from '../../../features/users/users-edit.state'
import { fetchUser, updateUser } from '../../../features/users/users.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { fetchBranches } from '../../../features/branches/branches.api'
import { useNavigate, useParams } from 'react-router-dom'
import useUsersList from '../list/users-list.hook'
import { editUserValidator, retrieveSuccessMessage, retrieveErrorMessage } from './users-edit.messager'

const useUsersEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { refetch: refetchUsersAfterEditing } = useUsersList()

  const {
    name,
    surname,
    username,
    branchId,
    email,
    password,
    role,
    customerId
  } = useSelector(state => state.users.edit)

  const {
    data: customers,
    isLoading: isCustomersLoading,
    hasFetched: doesCustomersLoaded
  } = useSelector(state => state.customers.api)

  const {
    data: branches,
    isLoading: isBranchesLoading,
    hasFetched: doesBranchesLoaded
  } = useSelector(state => state.branches.api)

  // Load customers
  useEffect(() => {
    if (!doesCustomersLoaded && !isCustomersLoading) {
      dispatch(fetchCustomers())
    }
  }, [doesCustomersLoaded, isCustomersLoading, dispatch])

  // Load branches
  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])

  // Auto-generate username from name + surname
  useEffect(() => {
    const n = name?.trim()
    const s = surname?.trim()
    if (n && s) dispatch(setUsername(`${n}.${s}`))
    else dispatch(setUsername(''))
  }, [name, surname, dispatch])

  // Fetch existing user data
  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const resp = await dispatch(fetchUser(id)).unwrap()
        if (resp.status === 'SUCCESS' && resp.data) {
          const u = resp.data
          u.name && dispatch(setName(u.name))
          u.surname && dispatch(setSurname(u.surname))
          u.email && dispatch(setEmail(u.email))
          u.branchId && dispatch(setBranchId(u.branchId))
          u.role && dispatch(setRole(u.role))
          u.customerId && dispatch(setCustomerId(u.customerId))
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }
    load()
  }, [id, dispatch])

  // Keep customerId in sync if branch changes
  useEffect(() => {
    if (branchId && branches?.length) {
      const b = branches.find(b => b.id === branchId)
      if (b?.customerId && b.customerId !== customerId) {
        dispatch(setCustomerId(b.customerId))
      }
    }
  }, [branchId, branches, customerId, dispatch])

  // Form field handlers
  const onChange = (e, field) => {
    const v = e.target.value
    switch (field) {
      case 'name': return dispatch(setName(v))
      case 'surname': return dispatch(setSurname(v))
      case 'email': return dispatch(setEmail(v))
      case 'password': return dispatch(setPassword(v))
      default: return
    }
  }

  // Select options
  const customersOptions = customers?.map(c => ({
    value: c.id,
    label: c.name
  })) || []

  const branchesOptions = customerId
    ? branches
      .filter(b => b.customerId === customerId)
      .map(b => ({ value: b.id, label: b.name }))
    : []

  // Fix: clearable selects must handle null
  const handleCustomersChange = selectedOption => {
    const newCustomerId = selectedOption?.value || ''
    dispatch(setCustomerId(newCustomerId))
    // Clear branch when customer changes/cleared
    dispatch(setBranchId(''))
  }

  const handleBranchesChange = selectedOption => {
    const newBranchId = selectedOption?.value || ''
    dispatch(setBranchId(newBranchId))
  }

  const roleOptions = ['super', 'client'].map(r => ({ value: r, label: r }))
  const handleRolesChange = selectedOption => {
    const newRole = selectedOption?.value || ''
    dispatch(setRole(newRole))
  }

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/users')
  }

  // Submit
  const editUser = async () => {
    try {
      const postData = { name, surname, username, password, email, branchId, role, customerId }
      if (!editUserValidator(postData)) return
      const resp = await dispatch(updateUser({ id, updatedData: postData })).unwrap()
      retrieveSuccessMessage(resp)
      clearPageHandler()
      refetchUsersAfterEditing()
      navigate('/users')
    } catch (err) {
      retrieveErrorMessage(err)
    }
  }

  return {
    name,
    surname,
    username,
    email,
    password,
    branchId,
    customerId,
    role,
    customersOptions,
    branchesOptions,
    roleOptions,
    onChange,
    handleCustomersChange,
    handleBranchesChange,
    handleRolesChange,
    editUser,
    clearPageHandler
  }
}

export default useUsersEdit
