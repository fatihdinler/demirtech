import { toast } from 'react-toastify'
import { removeLocation } from '../../../features/locations/locations.api'
import { useDispatch } from 'react-redux'
import useLocationsList from './locations-list.hook'

const useLocationsListRemover = () => {
  const dispatch = useDispatch()
  const { refetch: refetchLocationsAfterDeletion } = useLocationsList()

  const removeLocationData = async (id) => {
    try {
      _deleteLocationValidator(id)
      const response = await dispatch(removeLocation(id)).unwrap()
      if (response.status === 'SUCCESS') {
        toast.success(response.message || 'Lokasyon başarıyla silindi!', {
          position: 'top-right',
          autoClose: 3000,
        })
        return refetchLocationsAfterDeletion()
      } else {
        toast.error('Lokasyon silerken bir hata meydana geldi!', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting location:', error)
    }
  }

  const _deleteLocationValidator = (id) => {
    if (!id) {
      return toast.error('Silinecek lokasyon bulunamadı!', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  return {
    removeLocationData,
  }
}

export default useLocationsListRemover