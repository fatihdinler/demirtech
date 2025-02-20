import { toast } from 'react-toastify'
import { removeCustomer } from '../../../features/customers/customers.api'
import { useDispatch } from 'react-redux'
import useCustomersList from '../list/customers-list.hook'

const useCustomersRemover = () => {
  const dispatch = useDispatch()
  const { refetch: refetchCustomersAfterDeleting } = useCustomersList()

  const removeCustomerData = async (id) => {
    try {
      _deleteCustomerValidator(id)
      const response = await dispatch(removeCustomer(id)).unwrap()
      if (response.status === 'SUCCESS') {
        toast.success(response.message || 'Müşteri başarıyla silindi!', {
          position: 'top-right',
          autoClose: 3000,
        })
        return refetchCustomersAfterDeleting()
      } else {
        toast.error('Müşteri silerken bir hata meydana geldi!', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const _deleteCustomerValidator = (id) => {
    if (!id) {
      return toast.error('Silinecek müşteri bulunamadı!', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  return {
    removeCustomerData,
  }
}

export default useCustomersRemover