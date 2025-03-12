import { toast } from 'react-toastify'

export const editBranchValidator = (postData) => {
  if (!postData.name) {
    toast.error('Ad alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.customerId) {
    toast.error('Müşteri alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.address) {
    toast.error('Adres alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.contactInfo) {
    toast.error('İletişim bilgisi boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  return true
}

export const retrieveSuccessMessage = (response) => {
  if (response.status === 'SUCCESS') {
    toast.success(response.message || 'Şube başarıyla düzenlendi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } else {
    toast.error('Şube düzenlenirken bir hata meydana geldi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}
