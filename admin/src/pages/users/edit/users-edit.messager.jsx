import { toast } from 'react-toastify'

export const editUserValidator = (postData) => {
  if (!postData.name) {
    toast.error('Ad alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.surname) {
    toast.error('Soyad alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.username) {
    toast.error('Kullanıcı adı alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.email) {
    toast.error('E-mail alanı boş bırakılamaz', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(postData.email)) {
    toast.error('Geçerli bir e-posta adresi girin', {
      position: 'top-right',
      autoClose: 3000,
    })
    return false
  }
  if (!postData.role) {
    toast.error('Rol alanı boş bırakılamaz', {
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
    toast.success(response.message || 'Kullanıcı başarıyla düzenlendi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  } else {
    toast.error('Kullanıcı düzenlenirken bir hata meydana geldi!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

export const retrieveErrorMessage = (error) => {
  if (error.message) {
    toast.error(error.message, {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}
