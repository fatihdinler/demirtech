import { toast } from 'react-toastify'

export const editClimateValidator = (postData) => {
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
  if (!postData.model) {
    toast.error('Model alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  return true
}

export const retrieveSuccessMessage = (response) => {
  if (response.status === 'SUCCESS') {
    toast.success(response.message || 'Klima başarıyla düzenlendi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } else {
    toast.error('Klima düzenlenirken bir hata meydana geldi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}
