import { toast } from 'react-toastify'

export const createDeviceValidator = (postData) => {
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
  if (!postData.deviceType) {
    toast.error('Cihaz Tipi alanı boş bırakılamaz', {
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
  if (!postData.locationId) {
    toast.error('Lokasyon alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }

  return true
}

export const retrieveSuccessMessage = (response) => {
  if (response.status === 'SUCCESS') {
    toast.success(response.message || 'Cihaz başarıyla oluşturuldu!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } else {
    toast.error('Cihaz oluşturulurken bir hata meydana geldi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}
