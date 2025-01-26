import { setIsModalOpen } from '../../features/sidebar/sidebar.state'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const useSidebar = () => {
  const dispatch = useDispatch()
  const { isModalOpen } = useSelector(state => state.sidebar)
  const navigate = useNavigate()

  const handleDeviceClick = (index) => {
    navigate(`/device/${index}`)
  }
  return {
    isModalOpen,
    setIsModalOpen,
    handleDeviceClick,
  }
}

export default useSidebar