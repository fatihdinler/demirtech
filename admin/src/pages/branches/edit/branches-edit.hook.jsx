import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editBranchValidator, retrieveSuccessMessage } from './branches-edit.messager'
import { setName, setAddress, setContactInfo, setCustomerId, setRegionManagerId, clearPage } from '../../../features/branches/branches-edit.state'
import { fetchBranch, updateBranch } from '../../../features/branches/branches.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { useNavigate, useParams } from 'react-router-dom'
import useBranchesList from '../list/branches-list.hook'

const useBranchesEdit = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { refetch: refetchBranchesAfterEditing } = useBranchesList()

  const { name, customerId, regionManagerId, address, contactInfo } = useSelector(state => state.branches.edit)
  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)

  useEffect(() => {
    if (!doesCustomersLoaded && !isCustomersLoading) {
      dispatch(fetchCustomers())
    }
  }, [doesCustomersLoaded, isCustomersLoading, dispatch])

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await dispatch(fetchBranch(id)).unwrap()
        if (response.status === 'SUCCESS') {
          if (response.data.name) {
            dispatch(setName(response.data.name))
          }
          if (response.data.customerId) {
            dispatch(setCustomerId(response.data.customerId))
          }
          if (response.data.regionManagerId) {
            dispatch(setRegionManagerId(response.data.regionManagerId))
          }
          if (response.data.address) {
            dispatch(setAddress(response.data.address))
          }
          if (response.data.contactInfo) {
            dispatch(setContactInfo(response.data.contactInfo))
          }
        }
      } catch (error) {
        console.error('Error fetching branch:', error)
      }
    }
    if (id) fetchBranchData()
  }, [dispatch, id])

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
        break
      default:
        break
    }
  }

  const customersOptions = customers?.map(customer => ({ value: customer.id, label: customer.name }))
  const handleCustomersChange = (selectedOption) => dispatch(setCustomerId(selectedOption.value))

  const regionManagers = [{ id: '123123123', name: 'User 1' }, { id: '934880345', name: 'User 2' }]
  const mockDataForRegionManagerOptions = regionManagers.map(regionManager => ({ value: regionManager.id, label: regionManager.name }))
  const handleRegionManagerChange = (selectedOption) => dispatch(setRegionManagerId(selectedOption.value))

  const editBranch = async () => {
    const postData = {
      name,
      customerId,
      regionManagerId,
      address,
      contactInfo,
    }

    const isValid = editBranchValidator(postData)
    if (isValid) {
      const response = await dispatch(updateBranch({ id, updatedData: postData })).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchBranchesAfterEditing()
      return navigate('/branches')
    }
  }

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/branches')
  }

  return {
    name,
    customerId,
    regionManagerId,
    address,
    contactInfo,
    onChange,
    editBranch,
    clearPageHandler,
    customersOptions,
    handleCustomersChange,
    mockDataForRegionManagerOptions,
    handleRegionManagerChange,
    customers,
    regionManagers,
  }
}

export default useBranchesEdit
