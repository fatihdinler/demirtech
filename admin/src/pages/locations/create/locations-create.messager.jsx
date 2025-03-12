import { toast } from 'react-toastify'

export const createLocationsValidator = (postData) => {
  if (!postData.name) {
    toast.error('Ad alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.branchId) {
    toast.error('Şube alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  return true
}

export const retrieveSuccessMessage = (response) => {
  if (response.status === 'SUCCESS') {
    toast.success(response.message || 'Lokasyon başarıyla oluşturuldu!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } else {
    toast.error('Lokasyon oluşturulurken bir hata meydana geldi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}
