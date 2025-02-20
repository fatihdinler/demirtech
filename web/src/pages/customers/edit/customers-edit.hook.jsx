import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editCustomerValidator, retrieveSuccessMessage, } from './customers-edit.messager'
import { setName, setDescription, clearPage } from '../../../features/customers/customers-edit.state'
import { fetchCustomer, updateCustomer } from '../../../features/customers/customers.api'
import { useNavigate, useParams } from 'react-router-dom'
import useCustomersList from '../list/customers-list.hook'

const useCustomersEdit = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { name, description } = useSelector(state => state.customers.edit)
  const { refetch: refetchCustomersAfterEditing } = useCustomersList()

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await dispatch(fetchCustomer(id)).unwrap()
        if (response.status === 'SUCCESS') {
          if (response.data.name) {
            dispatch(setName(response.data.name))
          }
          if (response.data.description) {
            dispatch(setDescription(response.data.description))
          }
        }
      } catch (error) {
        console.error('Error fetching customer:', error)
      }
    }

    if (id) fetchCustomerData()
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

  const clearPageHandler = () => {
    dispatch(clearPage())
    navigate('/customers')
  }

  const editCustomer = async () => {
    const postData = {
      name,
      description,
    }

    const isValid = editCustomerValidator(postData)
    if (isValid) {
      const response = await dispatch(updateCustomer({ id, updatedData: postData })).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchCustomersAfterEditing()
      return navigate('/customers')
    }
  }

  return {
    name,
    description,
    onChange,
    clearPageHandler,
    editCustomer,
  }
}

export default useCustomersEdit