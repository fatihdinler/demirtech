import { toast } from 'react-toastify'
import { removeDevice } from '../../../features/devices/devices.api'
import { useDispatch } from 'react-redux'
import useDevicesList from './devices-list.hook'

const useDeviceRemover = () => {
  const dispatch = useDispatch()
  const { refetch: refetchDevicesAfterDeleting } = useDevicesList()

  const removeDeviceData = async (id) => {
    try {
      _deleteDeviceValidator(id)
      const response = await dispatch(removeDevice(id)).unwrap()
      if (response.status === 'SUCCESS') {
        toast.success(response.message || 'Cihaz başarıyla silindi!', {
          position: 'top-right',
          autoClose: 3000,
        })
        return refetchDevicesAfterDeleting()
      } else {
        toast.error('Cihaz silinirken bir hata meydana geldi!', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting device:', error)
    }
  }

  const _deleteDeviceValidator = (id) => {
    if (!id) {
      return toast.error('Silinecek cihaz bulunamadı!', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  return {
    removeDeviceData,
  }
}

export default useDeviceRemover
