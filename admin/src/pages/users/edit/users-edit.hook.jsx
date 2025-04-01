import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editUserValidator, retrieveSuccessMessage, retrieveErrorMessage } from './users-edit.messager'
import { setName, setSurname, setUsername, setBranchId, setEmail, setPassword, setRole, setCustomerId, clearPage } from '../../../features/users/users-edit.state'
import { fetchUser, updateUser } from '../../../features/users/users.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { fetchBranches } from '../../../features/branches/branches.api'
import { useNavigate, useParams } from 'react-router-dom'
import useUsersList from '../list/users-list.hook'

const useUsersEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name, surname, username, branchId, email, password, role, customerId } = useSelector(state => state.users.edit)

  const { data: customers, isLoading: isCustomersLoading, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)
  const { data: branches, isLoading: isBranchesLoading, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)
  const { refetch: refetchUsersAfterEditing } = useUsersList()

  useEffect(() => {
    if (!doesCustomersLoaded && !isCustomersLoading) {
      dispatch(fetchCustomers())
    }
  }, [doesCustomersLoaded, isCustomersLoading, dispatch])

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])

  useEffect(() => {
    const trimmedName = name?.trim()
    const trimmedSurname = surname?.trim()
    if (trimmedName && trimmedSurname) {
      dispatch(setUsername(`${trimmedName}.${trimmedSurname}`))
    } else {
      dispatch(setUsername(''))
    }
  }, [name, surname, dispatch])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await dispatch(fetchUser(id)).unwrap()
        if (response.status === 'SUCCESS' && response.data) {
          const userData = response.data
          if (userData.name) dispatch(setName(userData.name))
          if (userData.surname) dispatch(setSurname(userData.surname))
          if (userData.email) dispatch(setEmail(userData.email))
          if (userData.branchId) dispatch(setBranchId(userData.branchId))
          if (userData.role) dispatch(setRole(userData.role))
          if (userData.customerId) dispatch(setCustomerId(userData.customerId))
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    if (id) fetchUserData()
  }, [dispatch, id])

  useEffect(() => {
    if (branchId && branches && branches.length > 0) {
      const selectedBranch = branches.find(branch => branch.id === branchId)
      if (selectedBranch && selectedBranch.customerId && selectedBranch.customerId !== customerId) {
        dispatch(setCustomerId(selectedBranch.customerId))
      }
    }
  }, [branchId, branches, customerId, dispatch])

  const onChange = (event, field) => {
    event.preventDefault()
    switch (field) {
      case 'name':
        dispatch(setName(event.target.value))
        break
      case 'surname':
        dispatch(setSurname(event.target.value))
        break
      case 'email':
        dispatch(setEmail(event.target.value))
        break
      case 'password':
        dispatch(setPassword(event.target.value))
        break
      default:
        break
    }
  }

  const customersOptions = customers?.map(customer => ({ value: customer.id, label: customer.name }))
  const handleCustomersChange = (selectedOption) => dispatch(setCustomerId(selectedOption.value))

  const branchesOptions = customerId
    ? branches?.filter(branch => branch.customerId === customerId)
      .map(branch => ({ value: branch.id, label: branch.name }))
    : []
  const handleBranchesChange = (selectedOption) => dispatch(setBranchId(selectedOption.value))

  const roleOptions = ['super', 'client'].map(r => ({ value: r, label: r }))
  const handleRolesChange = (selectedOption) => dispatch(setRole(selectedOption.value))

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/users')
  }

  const editUser = async () => {
    try {
      const postData = {
        name,
        surname,
        username,
        password,
        email,
        branchId,
        role,
        customerId,
      }
      const isValid = editUserValidator(postData)
      if (isValid) {
        const response = await dispatch(updateUser({ id, updatedData: postData })).unwrap()
        retrieveSuccessMessage(response)
        clearPageHandler()
        refetchUsersAfterEditing()
        navigate('/users')
      }
    } catch (error) {
      retrieveErrorMessage(error)
    }
  }

  return {
    name,
    surname,
    username,
    branchId,
    email,
    password,
    role,
    customerId,
    onChange,
    customersOptions,
    handleCustomersChange,
    branchesOptions,
    handleBranchesChange,
    roleOptions,
    handleRolesChange,
    editUser,
    clearPageHandler,
  }
}

export default useUsersEdit
