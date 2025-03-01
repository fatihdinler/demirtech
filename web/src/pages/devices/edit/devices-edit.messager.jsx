import { toast } from 'react-toastify'

export const editDeviceValidator = (postData) => {
  if (!postData.name) {
    toast.error('Ad alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.chipId) {
    toast.error('Chip ID alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  } else if (!/^\d+$/.test(postData.chipId)) {
    toast.error('Chip ID alanı sayısal bir alan olmalıdır', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.climateId) {
    toast.error('Klima alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.deviceType) {
    toast.error('Cihaz Tipi alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.deviceLocationType) {
    toast.error('Cihaz Konum Tipi alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.measurementType) {
    toast.error('Ölçüm Tipi alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  return true
}

export const retrieveSuccessMessage = (response) => {
  if (response.status === 'SUCCESS') {
    toast.success(response.message || 'Cihaz başarıyla düzenlendi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } else {
    toast.error('Cihaz düzenlenirken bir hata meydana geldi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}
