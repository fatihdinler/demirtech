import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBranchValidator, retrieveSuccessMessage, } from './branches-create.messager'
import { setName, setAddress, setRegionManagerId, setCustomerId, setContactInfo, clearPage } from '../../../features/branches/branches-create.state'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { addBranch } from '../../../features/branches/branches.api'
import { useNavigate } from 'react-router-dom'
import useBranchesList from '../list/branches-list.hook'

const useBranchesCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name, customerId, regionManagerId, address, contactInfo } = useSelector(state => state.branches.create)
  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)
  const { refetch: refetchBranchesAfterCreation } = useBranchesList()

  useEffect(() => {
    if (!doesCustomersLoaded && !isCustomersLoading) {
      dispatch(fetchCustomers())
    }
  }, [doesCustomersLoaded, isCustomersLoading, dispatch])

  const onChange = (event, field) => {
    event.preventDefault()
    switch (field) {
      case 'name':
        dispatch(setName(event.target.value))
        break
      case 'address':
        dispatch(setAddress(event.target.value))
        break
      case 'contactInfo':
        dispatch(setContactInfo(event.target.value))
      default:
        break
    }
  }

  const customersOptions = customers?.map(customer => ({ value: customer.id, label: customer.name }))
  const handleCustomersChange = (selectedOption) => dispatch(setCustomerId(selectedOption.value))

  const regionManagers = [{ id: '123123123', name: 'User 1' }, { id: '934880345', name: 'User 2' }]
  const mockDataForRegionManagerOptions = regionManagers.map(regionManager => ({ value: regionManager.id, label: regionManager.name }))
  const handleRegionManagerChange = (selectedOption) => dispatch(setRegionManagerId(selectedOption.value))


  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/branches')
  }

  const createBranch = async () => {
    const postData = {
      name,
      customerId,
      // regionManagerId,
      address,
      contactInfo,
    }

    const isValid = createBranchValidator(postData)
    if (isValid) {
      const response = await dispatch(addBranch(postData)).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchBranchesAfterCreation()
      return navigate('/branches')
    }
  }

  return {
    name,
    customerId,
    regionManagerId,
    address,
    contactInfo,
    onChange,
    createBranch,
    clearPageHandler,
    customersOptions,
    handleCustomersChange,
    customers,
    regionManagers,
    mockDataForRegionManagerOptions,
    handleRegionManagerChange,
  }
}

export default useBranchesCreate