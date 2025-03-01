import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editClimateValidator, retrieveSuccessMessage } from './climates-edit.messager'
import { setName, setDescription, setModel, setBranchId, clearPage } from '../../../features/climates/climates-edit.state'
import { fetchClimate, updateClimate } from '../../../features/climates/climates.api'
import { fetchBranches } from '../../../features/branches/branches.api'
import { useNavigate, useParams } from 'react-router-dom'
import { climateModels } from '../../../utils/climate-models'
import useClimatesList from '../list/climates-list.hook'

const useClimatesEdit = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { refetch: refetchClimatesAfterEditing } = useClimatesList()

  const { name, description, model, branchId } = useSelector(state => state.climates.edit)
  const { data: branches, isLoading: isBranchesLoading, hasFetched: doesBranchesLoaded } = useSelector(state => state.branches.api)

  useEffect(() => {
    if (!doesBranchesLoaded && !isBranchesLoading) {
      dispatch(fetchBranches())
    }
  }, [doesBranchesLoaded, isBranchesLoading, dispatch])

  useEffect(() => {
    const fetchClimateData = async () => {
      try {
        const response = await dispatch(fetchClimate(id)).unwrap()
        if (response.status === 'SUCCESS') {
          if (response.data.name) {
            dispatch(setName(response.data.name))
          }
          if (response.data.description) {
            dispatch(setDescription(response.data.description))
          }
          if (response.data.model) {
            dispatch(setModel(response.data.model))
          }
          if (response.data.branchId) {
            dispatch(setBranchId(response.data.branchId))
          }
        }
      } catch (error) {
        console.error('Error fetching climate:', error)
      }
    }
    if (id) fetchClimateData()
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

  const branchesOptions = branches?.map(branch => ({ value: branch.id, label: branch.name }))
  const handleBranchesChange = (selectedOption) => dispatch(setBranchId(selectedOption.value))

  const climateModelsOptions = climateModels.map(climateModel => ({ value: climateModel, label: climateModel }))
  const handleClimateModelsChange = (selectedOption) => dispatch(setModel(selectedOption.value))

  const editClimate = async () => {
    const postData = {
      name,
      description,
      model,
      branchId,
    }

    const isValid = editClimateValidator(postData)
    if (isValid) {
      const response = await dispatch(updateClimate({ id, updatedData: postData })).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchClimatesAfterEditing()
      return navigate('/climates')
    }
  }

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/climates')
  }

  return {
    name,
    description,
    model,
    branchId,
    onChange,
    branchesOptions,
    handleBranchesChange,
    clearPageHandler,
    editClimate,
    climateModelsOptions,
    handleClimateModelsChange,
  }
}

export default useClimatesEdit
