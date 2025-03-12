import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createLocationsValidator, retrieveSuccessMessage, } from './locations-create.messager'
import { setName, setDescription, setBranchId, setCustomerId, clearPage } from '../../../features/locations/locations-create.state'
import { fetchBranches } from '../../../features/branches/branches.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { addLocation } from '../../../features/locations/locations.api'
import { useNavigate } from 'react-router-dom'
import useLocationsList from '../list/locations-list.hook'

const useLocationsCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name, description, branchId, customerId, } = useSelector(state => state.locations.create)

  const { data: branches, isLoading: isBranchesLoading, error: errorBranches, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)
  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)

  const { refetch: refetchLocationsAfterCreation } = useLocationsList()

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])

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
      case 'description':
        dispatch(setDescription(event.target.value))
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

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/locations')
  }

  const createLocation = async () => {
    const postData = {
      name,
      description,
      branchId,
    }

    const isValid = createLocationsValidator(postData)
    if (isValid) {
      const response = await dispatch(addLocation(postData)).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchLocationsAfterCreation()
      return navigate('/locations')
    }
  }

  return {
    name,
    description,
    branchId,
    customerId,
    onChange,
    branchesOptions,
    handleBranchesChange,
    customersOptions,
    handleCustomersChange,
    clearPageHandler,
    createLocation,
  }
}

export default useLocationsCreate