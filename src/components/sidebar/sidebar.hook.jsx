import { setIsModalOpen } from '../../features/sidebar/sidebar.state'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const useSidebar = () => {
  const { isModalOpen } = useSelector(state => state.sidebar)
  const navigate = useNavigate()

  const handleDeviceClick = (deviceId) => {
    navigate(`/device-detail/${deviceId}`)
  }
  return {
    isModalOpen,
    setIsModalOpen,
    handleDeviceClick,
  }
}

export default useSidebar