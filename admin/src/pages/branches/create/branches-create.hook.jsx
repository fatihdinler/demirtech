import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setName,
  setAddress,
  setUserIds,
  setCustomerId,
  setContactInfo,
  clearPage
} from '../../../features/branches/branches-create.state'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { fetchUsers } from '../../../features/users/users.api'
import { addBranch } from '../../../features/branches/branches.api'
import { createBranchValidator, retrieveSuccessMessage } from './branches-create.messager'
import { useNavigate } from 'react-router-dom'
import useBranchesList from '../list/branches-list.hook'

const useBranchesCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    name,
    customerId,
    address,
    contactInfo,
    userIds
  } = useSelector(state => state.branches.create)

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

  const { refetch: refetchBranchesAfterCreation } = useBranchesList()

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

  const onChange = (event, field) => {
    event.preventDefault()
    const val = event.target.value
    if (field === 'name') dispatch(setName(val))
    else if (field === 'address') dispatch(setAddress(val))
    else if (field === 'contactInfo') dispatch(setContactInfo(val))
  }

  const customersOptions = customers?.map(c => ({ value: c.id, label: c.name })) || []
  const handleCustomersChange = (selected) => {
    dispatch(setCustomerId(selected?.value || ''))
  }

  const usersOptions = users?.map(u => ({
    value: u.id,
    label: `${u.name} ${u.surname}`
  })) || []
  const handleUsersChange = (selectedOptions) => {
    // selectedOptions bir array, tekil veya boş olabilir
    const values = Array.isArray(selectedOptions)
      ? selectedOptions.map(opt => opt.value)
      : []
    dispatch(setUserIds(values))
  }

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/branches')
  }

  const createBranch = async () => {
    const postData = {
      name,
      customerId,
      userIds,
      address,
      contactInfo,
    }

    if (!createBranchValidator(postData)) return

    const response = await dispatch(addBranch(postData)).unwrap()
    retrieveSuccessMessage(response)
    clearPageHandler()
    refetchBranchesAfterCreation()
    navigate('/branches')
  }

  return {
    name,
    customerId,
    address,
    contactInfo,
    userIds,
    onChange,
    createBranch,
    clearPageHandler,
    customersOptions,
    handleCustomersChange,
    usersOptions,
    handleUsersChange,
  }
}

export default useBranchesCreate
