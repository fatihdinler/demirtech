import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editLocationValidator, retrieveSuccessMessage } from './locations-edit.messager'
import { setName, setDescription, setModel, setBranchId, setCustomerId, clearPage } from '../../../features/locations/locations-edit.state'
import { fetchLocation, updateLocation } from '../../../features/locations/locations.api'
import { fetchBranches } from '../../../features/branches/branches.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { useNavigate, useParams } from 'react-router-dom'
import useLocationsList from '../list/locations-list.hook'

const useLocationsEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { name, description, model, branchId, customerId } = useSelector(state => state.locations.edit)

  const { data: branches, isLoading: isBranchesLoading, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)
  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)

  const { refetch: refetchLocationsAfterEditing } = useLocationsList()

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchCustomers())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])

  useEffect(() => {
    if (branchId && branches?.length > 0) {
      const selectedBranch = branches.find(branch => branch.id === branchId)
      if (selectedBranch && selectedBranch.customerId !== customerId) {
        dispatch(setCustomerId(selectedBranch.customerId))
      }
    }
  }, [branchId, branches, customerId, dispatch])

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await dispatch(fetchLocation(id)).unwrap()
        if (response.status === 'SUCCESS') {
          if (response.data.name) {
            dispatch(setName(response.data.name))
          }
          if (response.data.description) {
            dispatch(setDescription(response.data.description))
          }
          if (response.data.branchId) {
            dispatch(setBranchId(response.data.branchId))
          }
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }
    if (id) fetchLocationData()
  }, [dispatch, id])

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
  const handleCustomersChange = (selectedOption) => {
    dispatch(setCustomerId(selectedOption.value))
    dispatch(setBranchId(null))
  }

  const branchesOptions = customerId
    ? branches?.filter(branch => branch.customerId === customerId)
      .map(branch => ({ value: branch.id, label: branch.name }))
    : []
  const handleBranchesChange = (selectedOption) => dispatch(setBranchId(selectedOption.value))

  const editLocation = async () => {
    const postData = {
      name,
      description,
      branchId,
    }

    const isValid = editLocationValidator(postData)
    if (isValid) {
      const response = await dispatch(updateLocation({ id, updatedData: postData })).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchLocationsAfterEditing()
      return navigate('/locations')
    }
  }

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/locations')
  }

  return {
    name,
    description,
    model,
    branchId,
    customerId,
    onChange,
    branchesOptions,
    handleBranchesChange,
    customersOptions,
    handleCustomersChange,
    clearPageHandler,
    editLocation,
  }
}

export default useLocationsEdit
