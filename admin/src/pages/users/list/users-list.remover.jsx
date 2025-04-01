import { toast } from 'react-toastify'
import { removeUser } from '../../../features/users/users.api'
import { useDispatch } from 'react-redux'
import useUsersList from './users-list.hook'

const useUsersListRemover = () => {
  const dispatch = useDispatch()
  const { refetch: refetchUsersAfterDeletion } = useUsersList()

  const removeUserData = async (id) => {
    try {
      _deleteUserValidation(id)
      const response = await dispatch(removeUser(id)).unwrap()
      if (response.status === 'SUCCESS') {
        toast.success(response.message || 'Kullanıcı başarıyla silindi!', {
          position: 'top-right',
          autoClose: 3000,
        })
        return refetchUsersAfterDeletion()
      } else {
        toast.error('Kullanıcı silerken bir hata meydana geldi!', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const _deleteUserValidation = (id) => {
    if (!id) {
      return toast.error('Silinecek kullanıcı bulunamadı!', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  return {
    removeUserData,
  }
}

export default useUsersListRemover