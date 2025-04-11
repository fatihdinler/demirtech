import { toast } from 'react-toastify'

export const retrieveErrorMessage = (error) => {
  if (error.message) {
    toast.error(error.message, {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}