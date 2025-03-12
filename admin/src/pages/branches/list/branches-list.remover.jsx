import { toast } from 'react-toastify'
import { removeBranch } from '../../../features/branches/branches.api'
import { useDispatch } from 'react-redux'
import useBranchesList from '../list/branches-list.hook'

const useBranchesRemover = () => {
  const dispatch = useDispatch()
  const { refetch: refetchBranchesAfterDeleting } = useBranchesList()

  const removeBranchData = async (id) => {
    try {
      _deleteBranchValidator(id)
      const response = await dispatch(removeBranch(id)).unwrap()
      if (response.status === 'SUCCESS') {
        toast.success(response.message || 'Şube başarıyla silindi!', {
          position: 'top-right',
          autoClose: 3000,
        })
        return refetchBranchesAfterDeleting()
      } else {
        toast.error('Şube silerken bir hata meydana geldi!', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting branch:', error)
    }
  }

  const _deleteBranchValidator = (id) => {
    if (!id) {
      return toast.error('Silinecek şube bulunamadı!', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  return {
    removeBranchData,
  }
}

export default useBranchesRemover