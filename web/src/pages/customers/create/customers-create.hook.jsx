import { useDispatch, useSelector } from 'react-redux'
import { createCustomerValidator, retrieveSuccessMessage, } from './customers-create.messager'
import { setName, setDescription, clearPage } from '../../../features/customers/customers-create.state'
import { addCustomer } from '../../../features/customers/customers.api'
import { useNavigate } from 'react-router-dom'
import useCustomersList from '../list/customers-list.hook'

const useCustomersCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name, description } = useSelector(state => state.customers.create)
  const { refetch: refetchCustomersAfterCreation } = useCustomersList()

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

  const createCustomer = async () => {
    const postData = {
      name,
      description,
    }

    const isValid = createCustomerValidator(postData)
    if (isValid) {
      const response = await dispatch(addCustomer(postData)).unwrap()
      retrieveSuccessMessage(response)
      clearPageHandler()
      refetchCustomersAfterCreation()
      return navigate('/customers')
    }
  }

  return {
    name,
    description,
    onChange,
    createCustomer,
    clearPageHandler,
  }
}

export default useCustomersCreate