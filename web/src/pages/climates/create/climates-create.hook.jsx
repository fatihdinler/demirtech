import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createClimateValidator, retrieveSuccessMessage, } from './climates-create.messager'
import { setName, setDescription, setModel, setBranchId, setCustomerId, clearPage } from '../../../features/climates/climates-create.state'
import { fetchBranches } from '../../../features/branches/branches.api'
import { fetchCustomers } from '../../../features/customers/customers.api'
import { addClimate } from '../../../features/climates/climates.api'
import { useNavigate } from 'react-router-dom'
import { climateModels } from '../../../utils/constants'
import useClimatesList from '../list/climates-list.hook'

const useClimatesCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name, description, model, branchId, customerId, } = useSelector(state => state.climates.create)

  const { data: branches, isLoading: isBranchesLoading, error: errorBranches, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)
  const { data: customers, isLoading: isCustomersLoading, error: errorCustomers, hasFetched: doesCustomersLoaded } = useSelector(state => state.customers.api)

  const { refetch: refetchClimatesAfterCreation } = useClimatesList()

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

  const climateModelsOptions = climateModels.map(climateModel => ({ value: climateModel, label: climateModel }))
  const handleClimateModelsChange = (selectedOption) => dispatch(setModel(selectedOption.value))

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/climates')
  }

  const createClimate = async () => {
    const postData = {
      name,
      description,
      model,
      branchId,
    }

    const isValid = createClimateValidator(postData)
    if (isValid) {
      const response = await dispatch(addClimate(postData)).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchClimatesAfterCreation()
      return navigate('/climates')
    }
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
    createClimate,
    climateModelsOptions,
    handleClimateModelsChange,
  }
}

export default useClimatesCreate