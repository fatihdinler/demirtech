import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createUserValidator, retrieveSuccessMessage, retrieveErrorMessage, } from './users-create.messager'
import { setName, setSurname, setUsername, setBranchId, setEmail, setPassword, setRole, setCustomerId, clearPage } from '../../../features/users/users-create.state'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { fetchBranches } from '../../../features/branches/branches.api'
import { addUser } from '../../../features/users/users.api'
import { useNavigate } from 'react-router-dom'
import useUsersList from '../list/users-list.hook'

const useUsersCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error } = useSelector(state => state.users.api)
  const { name, surname, username, branchId, email, password, role, customerId } = useSelector(state => state.users.create)
  const { data: customers, isLoading: isCustomersLoading, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)
  const { data: branches, isLoading: isBranchesLoading, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)
  const { refetch: refetchUsersAfterCreation } = useUsersList()

  console.log(error)
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

  const createUser = async () => {
    try {
      const postData = {
        name,
        surname,
        username,
        password,
        email,
        branchId,
        role,
      }

      const isValid = createUserValidator(postData)
      if (isValid) {
        const response = await dispatch(addUser(postData)).unwrap()
        retrieveSuccessMessage(response)
        clearPageHandler()
        refetchUsersAfterCreation()
        return navigate('/users')
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
    createUser,
    clearPageHandler,
  }
}

export default useUsersCreate
