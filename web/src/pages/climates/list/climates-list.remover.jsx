import { toast } from 'react-toastify'
import { removeClimate } from '../../../features/climates/climates.api'
import { useDispatch } from 'react-redux'
import useClimatesList from './climates-list.hook'

const useClimateRemover = () => {
  const dispatch = useDispatch()
  const { refetch: refetchClimatesAfterDeleting } = useClimatesList()

  const removeClimateData = async (id) => {
    try {
      _deleteClimateValidator(id)
      const response = await dispatch(removeClimate(id)).unwrap()
      if (response.status === 'SUCCESS') {
        toast.success(response.message || 'Klima başarıyla silindi!', {
          position: 'top-right',
          autoClose: 3000,
        })
        return refetchClimatesAfterDeleting()
      } else {
        toast.error('Klima silerken bir hata meydana geldi!', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting climate:', error)
    }
  }

  const _deleteClimateValidator = (id) => {
    if (!id) {
      return toast.error('Silinecek klima bulunamadı!', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  return {
    removeClimateData,
  }
}

export default useClimateRemover