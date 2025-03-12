import { toast } from 'react-toastify'

export const editCustomerValidator = (postData) => {
  if (!postData.name) {
    toast.error('Ad alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  return true
}

export const retrieveSuccessMessage = (response) => {
  if (response.status === 'SUCCESS') {
    toast.success(response.message || 'Müşteri başarıyla düzenlendi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } else {
    toast.error('Müşteri düzenlerken bir hata meydana geldi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}
